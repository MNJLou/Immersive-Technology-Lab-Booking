import {getSession} from "@/utils/sessionManagment"
import {connectMongo} from "@/utils/connectDB";
import {NextResponse, NextRequest} from "next/server";
import Booking from "@/models/booking";
import {DEV_PODS, PLAY_PODS} from "../../../../../libs/data";
import {toISOStringWithTimezone} from "@/utils/bookingsHelper";

export const dynamic = "force-dynamic";

/**
 * Create a booking in the database
 * @param request
 */
export async function POST(request: Request) {
  
  const session = await getSession()
  const user = session.user;
  const studentNumber = user.studentNumber;
  const times = ["9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "13:00", "13:30"];
  
  /* Create a booking in the mongoDB database */
  try {
    const {
      date: date,
      bookings: bookings,
      devBooking: devBooking,
      podPreference: podPreference,
      eventIds: eventIds,
      icsUids: icsUids
    } = await request.json()
    
    await connectMongo();
    const name = user.name;
    const surname = user.surname;
    
    let objectIds = [] as string[];

    await Booking.create(bookings.map((booking: { start: string }, index: number) => {
      return {
        studentNumber,
        name,
        surname,
        date,
        time: booking.start,
        devBooking,
        podPreference,
        eventId: eventIds[index],
        icsUid: icsUids[index]
      };
    })).then(async (response: any) => {//Jerome check
      objectIds = response.map((booking: any) => booking._id);
    });
    
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
      if (devBooking && bookingTimeSlot.studentNumber.length > DEV_PODS || !devBooking && bookingTimeSlot.studentNumber.length > PLAY_PODS) {
        // delete the bookings that are not supposed to be there
        await Booking.deleteMany({_id: {$in: objectIds}});
        NextResponse.json({message: "Booking failed, the time slot is already full, try again."}, {status: 400});
      }
    }
    
    return NextResponse.json({message: "Booking created successfully"}, {status: 200});
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({message: "Something went wrong while creating a booking"}, {status: 500});
  }
}

/**
 * Delete a booking from the database
 * @param request
 */
export async function DELETE(request: NextRequest) {

  const searchParams = request.nextUrl.searchParams;
  const bookingIds = searchParams.getAll('id') as string[];

  await connectMongo();
  const bookings = await Booking.find({_id: {$in: bookingIds}});
  const eventIds = bookings.map((booking: any) => booking.eventId);
  const icsUids = bookings.map((booking: any) => booking.icsUid);
  const times = bookings.map((booking: any) => booking.time);
  const dates = bookings.map((booking: any) => booking.date);
  const podPreferences = bookings.map((booking: any) => booking.podPreference);
  const devBookings = bookings[0].devBooking;
  await Booking.deleteMany({_id: {$in: bookingIds}});
  return NextResponse.json({
    message: "Booking deleted successfully",
    eventIds,
    icsUids,
    times,
    dates,
    podPreferences,
    devBookings
  });
}

// Get all bookings for a user including today and beyond
export async function GET() {
  const session = await getSession()
  const user = session.user;
  const studentNumber = user.studentNumber;
  await connectMongo();
  const bookings = await Booking.find({
    studentNumber: studentNumber,
    date: {$gte: toISOStringWithTimezone(new Date())}
  });
  return NextResponse.json({bookings});
}
