// googleService/bookings/booking

import {google} from 'googleapis';
import {getSession} from "@/utils/sessionManagment"
import {NextResponse, NextRequest} from "next/server";
import {sendCreateEmail, sendCancelEmail} from "@/utils/emailer";
import {emailIcsProps} from "../../../../../../libs/interfaces";
import {format} from 'date-fns';
import {confirmationHtml, cancellationHtml} from "../../../../../../libs/mail";
import Booking from "@/models/booking";
import {DEV_PODS, PLAY_PODS} from "../../../../../../libs/data";

export const dynamic = "force-dynamic";

const calendar = google.calendar({ version: 'v3' });

const CREDENTIALS = JSON.parse(process.env.GOOGLE_API_CREDENTIALS as string);
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const CALENDAR_OPTIONS = {
  calendarId: process.env.CALENDAR_ID as string,
  calendar,
  TIMEOFFSET: '+02:00',
  TIMEZONE: 'Africa/Johannesburg',
  auth: new google.auth.JWT({
    email: CREDENTIALS.client_email,
    key: CREDENTIALS.private_key,
    scopes: SCOPES,
  }),
};

export async function POST(request: Request) {

  const session = await getSession()
  const user = session.user;
  const {date: date, bookings: bookings, devBooking: devBooking, podPreference: podPreference} = await request.json();
  const bookingType = devBooking ? "Dev Booking" : "Play Booking";
  const times = ["9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "13:00", "13:30"];

  // Declare the body here in case of an error in the try block // 
  let body = {message: "", bookingIDs: [], icsUids: []} as { message: string, bookingIDs: string[], icsUids: string[] };
  try {

    /* Check if two bookings were made at the same time (race condition) */
    const bookingsAtTime = await Booking.find({
      date: date,
      time: {$in: bookings.map((booking: { start: string }) => booking.start)}
    });

    let bookingsAtTimeAfter = times.map((time) => {
      return {time: time, studentNumber: [] as string[]};
    });

    bookingsAtTime.forEach((booking: any) => {
      bookingsAtTimeAfter.forEach((bookingTimeSlot: any) => {
        if (bookingTimeSlot.time === booking.time) {
          bookingTimeSlot.studentNumber.push(booking.studentNumber);
        }
      });
    });

    for (const bookingTimeSlot of bookingsAtTimeAfter) {
      if (devBooking && bookingTimeSlot.studentNumber.length >= DEV_PODS || !devBooking && bookingTimeSlot.studentNumber.length >= PLAY_PODS) {
        NextResponse.json({message: "Booking failed, the time slot is already full, try again."}, {status: 400});
      }
    }
    
    await Promise.all(bookings.map(async (booking: { start: string, end: string }) => {
      const startTime = (parseInt(booking.start.split(":")[0]) < 10) ? "0" + booking.start : booking.start; // ensure that 9:00 is formatted as 09:00, etc.
      const endTime = (parseInt(booking.end.split(":")[0]) < 10) ? "0" + booking.end : booking.end;
      const calendarResponse = await CALENDAR_OPTIONS.calendar.events.insert({
        auth: CALENDAR_OPTIONS.auth,
        calendarId: CALENDAR_OPTIONS.calendarId,
        requestBody: {
          start: {
            dateTime: new Date(`${date}T${startTime}${CALENDAR_OPTIONS.TIMEOFFSET}`).toISOString(),
            timeZone: CALENDAR_OPTIONS.TIMEZONE,
          },
          end: {
            dateTime: new Date(`${date}T${endTime}${CALENDAR_OPTIONS.TIMEOFFSET}`).toISOString(),
            timeZone: CALENDAR_OPTIONS.TIMEZONE,
          },
          summary: `${bookingType} - ${user.studentNumber}`,
          description: `Name: ${user.name} ${user.surname}\nEmail: ${user.email}\nDegree: ${user.degree}\nYear of Study: ${user.yearOfStudy}\nPod Preference: ${podPreference}`,
          // attendees: [{email: user.email}], // Do not have the necessary privileges to send emails to attendees
        },
      });
      return calendarResponse;
    })).then(async (response) => {
      let icsUids = [] as string[];
      let ids = [] as string[];
      let formattedDate = format(new Date(date), "do MMMM yyyy");
      try {
        const email = user.email;
        const subject = "Immersive Technology Lab Booking Confirmation";
        const textHtml = confirmationHtml(bookings, devBooking, formattedDate);
        const icsList = bookings.map((booking: { start: string }) => {
          let startTime = booking.start;
          if (parseInt(startTime.split(":")[0]) < 10) {
            startTime = "0" + startTime;
          }
          return {
            event: {
              start: new Date(`${date}T${startTime}${CALENDAR_OPTIONS.TIMEOFFSET}`),
              summary: `${bookingType} - ${user.studentNumber}`,
              description: `Name: ${user.name} ${user.surname}\nEmail: ${user.email}\nDegree: ${user.degree}\nYear of Study: ${user.yearOfStudy}\nPod Preference: ${podPreference}`,
              url: process.env.NEXT_PUBLIC_URL as string,
            },
            student: {
              name: `${user.name} ${user.surname}`,
              studentNumber: user.studentNumber,
              email: user.email,
            },
            devBooking: devBooking,
          } as emailIcsProps;
        });

        ids = response.map((response: { data: { id: string; }; }) => response.data.id);
        icsUids = await sendCreateEmail({email, subject, textHtml, ids, icsList}) as string[];
        icsUids = icsUids.length === 0 ? bookings.map(() => "none") : icsUids;
      } catch (error) {
        console.error("Error sending email:", error);
      }

      body = {message: "Booking created successfully", bookingIDs: ids, icsUids: icsUids};
    }).catch((error) => {
      console.error('Error:', error);
      return NextResponse.json({message: "Something went wrong while creating a booking"}, {status: 500});
    });
    return NextResponse.json(body, {status: 200});
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({message: "Something went wrong while creating a booking"}, {status: 500});
  }
}

export async function DELETE(request: NextRequest) {

  const searchParams = request.nextUrl.searchParams;
  const eventIds = searchParams.getAll('id') as string[];
  const icsUids = searchParams.getAll('icsUid') as string[];
  const times = searchParams.getAll('time') as string[];
  const date = format(new Date(searchParams.get('date') as string), "yyyy-MM-dd");
  const podPreferences = searchParams.getAll('podPreference').map((podPreference) => parseInt(podPreference)) as number[];
  const devBooking = searchParams.get('devBooking') === "true" ? true : false;
  const formattedDate = format(new Date(date), "do MMMM yyyy");

  try {
    if (!eventIds || eventIds.length === 0) {
      return NextResponse.json({message: "No eventIds found"}, {status: 400});
    }

    await Promise.all(eventIds.map(async (eventId: string) => {
      await CALENDAR_OPTIONS.calendar.events.delete({
        auth: CALENDAR_OPTIONS.auth,
        calendarId: CALENDAR_OPTIONS.calendarId,
        eventId: eventId,
      });
      return eventId;
    })).then(async () => {

      const session = await getSession();
      const user = session.user;
      const bookingType = devBooking ? "Dev Booking" : "Play Booking";
      const email = user.email;

      let startTimes = times.map((time) => {
        if (parseInt(time.split(":")[0]) < 10) {
          return "0" + time;
        }
        return time;
      });

      const subject = "Immersive Technology Lab Booking Cancellation";
      const textHtml = cancellationHtml(devBooking, formattedDate, startTimes);

      const icsList = eventIds.map((eventId: string, index: number) => {
        return {
          event: {
            start: new Date(`${date}T${startTimes[index]}${CALENDAR_OPTIONS.TIMEOFFSET}`),
            summary: `${bookingType} - ${user.studentNumber}`,
            description: `Name: ${user.name}${user.surname}\nEmail: ${user.email}\nDegree: ${user.degree}\nYear of Study: ${user.yearOfStudy}\nPod Preference: ${podPreferences[index]}`,
            url: process.env.NEXT_PUBLIC_URL as string,
          },
          student: {
            name: `${user.name} ${user.surname}`,
            studentNumber: user.studentNumber,
            email: user.email,
          },
          devBooking: devBooking,
        } as emailIcsProps;
      })

      if (email) {
        if (icsUids && icsUids[0] === "none") {
          return NextResponse.json({message: `Booking deleted successfully NO icsUids`, eventIds: eventIds});
        }
        try {
          await sendCancelEmail({email, subject, textHtml, icsUids, icsList});
        } catch (error) {
          console.error("Error sending email:", error);
        }
      }
    });
    return NextResponse.json({message: "Booking deleted successfully", eventIds: eventIds});
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({message: "Something went wrong while deleting a booking"}, {status: 500});
  }
}
    