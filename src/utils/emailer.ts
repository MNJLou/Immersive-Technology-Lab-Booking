'use server';

import {emailIcsProps, emailerProps, emailerCancelProps} from '../../libs/interfaces';
import moment from 'moment';
import ical, {
  ICalAttendeeRole,
  ICalAttendeeStatus,
  ICalAttendeeType,
  ICalCalendarMethod,
  ICalEventStatus,
  ICalEventTransparency
} from 'ical-generator';

/**
 * Send a confirmation email using email/confirm route
 * @param email
 * @param subject
 * @param textHtml
 * @param ids
 * @param icsList
 */
const sendCreateEmail = async ({email, subject, textHtml, ids, icsList}: emailerProps): Promise<string[]> => {

  const contentList = icsList.map(ics => createIcs(ics));
  let uids = contentList.map(content => content.split("UID:")[1].split("\n")[0]);
  
  await fetch(process.env.NEXT_PUBLIC_URL + '/api/email/confirm', {
          method: 'POST',
          headers: {'Content-Type': 'application/json',},
          body: JSON.stringify({
              email,
              subject,
              textHtml,
              ids,
              contentList,
          }),
  })
  return uids;
}

/**
 * Send a cancellation email using email/cancel route
 * @param email
 * @param subject
 * @param textHtml
 * @param icsUids
 * @param icsList
 */
const sendCancelEmail = async ({email, subject, textHtml, icsUids, icsList}: emailerCancelProps) => {
  
  let contentList = icsList.map(ics => deleteIcs(ics));
  contentList = contentList.map((content, index) => {
    return (content.split("UID:")[0] + "UID:" + icsUids[index] + "\n" + content.split("UID:")[1].split("\n").slice(1).join("\n")).split("SEQUENCE:0").join("SEQUENCE:1");
  });
  
  await fetch(process.env.NEXT_PUBLIC_URL + '/api/email/cancel', {
      method: 'POST',
      headers: {'Content-Type': 'application/json',},
      body: JSON.stringify({
          email,
          subject,
          textHtml,
          icsUids,
          contentList,
      }),
  })
  return {};
}

/**
 * Create an ICS file for a booking confirmation
 * @param event
 * @param student
 * @param devBooking
 */
const createIcs = ({event, student, devBooking}: emailIcsProps) => {
  return ical({
    method: ICalCalendarMethod.REQUEST,
    prodId: '//Google Inc//Google Calendar 70.9054//EN',
    timezone: 'Africa/Johannesburg',
    scale: 'GREGORIAN',
    events: [
      {
        start: require('moment-timezone')(event.start).tz('Africa/Johannesburg').toDate(),
        status: ICalEventStatus.CONFIRMED,
        end: devBooking
          ? require('moment-timezone')(event.start).tz('Africa/Johannesburg').add(55, 'minutes').toDate()
          : require('moment-timezone')(event.start).tz('Africa/Johannesburg').add(25, 'minutes').toDate(),
        summary: 'Immersive Technology Lab Booking',
        transparency: ICalEventTransparency.OPAQUE,
        organizer: {
          name: 'Immersive Technology Lab Staff',
          email: process.env.EMAIL_SENDER,
          mailto: process.env.EMAIL_SENDER
        },
        description: `${(devBooking ? "Development booking" : "Play Booking")} for ${student.name} (${student.studentNumber})`,
        location: 'Room 4-62, Level 4, Department of Information Science, IT Building, Hillcrest, Pretoria, 0083',
        attendees: [
          {
            email: student.email,
            name: student.name,
            status: ICalAttendeeStatus.ACCEPTED,
            rsvp: true,
            type: ICalAttendeeType.INDIVIDUAL,
            role: ICalAttendeeRole.REQ,
          },
        ]
      }
    ]
  }).toString()
}

/**
 * Create an ICS file for a booking cancellation
 * @param event
 * @param student
 * @param devBooking
 */
const deleteIcs = ({event, student, devBooking}: emailIcsProps) => {
  return ical({
    method: ICalCalendarMethod.CANCEL,
    prodId: '//Google Inc//Google Calendar 70.9054//EN',
    timezone: 'Africa/Johannesburg',
    scale: 'GREGORIAN',
    events: [
      {
        start: require('moment-timezone')(event.start).tz('Africa/Johannesburg').toDate(),
        status: ICalEventStatus.CANCELLED,
        end: devBooking
          ? require('moment-timezone')(event.start).tz('Africa/Johannesburg').add(55, 'minutes').toDate()
          : require('moment-timezone')(event.start).tz('Africa/Johannesburg').add(25, 'minutes').toDate(),
        summary: 'Immersive Technology Lab Booking Cancellation',
        transparency: ICalEventTransparency.OPAQUE,
        organizer: {
          name: 'Immersive Technology Lab Staff',
          email: process.env.EMAIL_SENDER,
          mailto: process.env.EMAIL_SENDER
        },
        description: `${(devBooking ? "Development booking" : "Play Booking")} for ${student.name} (${student.studentNumber})`,
        location: 'Room 4-62, Level 4, Department of Information Science, IT Building, Hillcrest, Pretoria, 0083',
        attendees: [
          {
            email: 'bigtgang@gmail.com',
            name: 'itl-booking-test',
            role: ICalAttendeeRole.CHAIR,
            rsvp: false,
            status: ICalAttendeeStatus.NEEDSACTION,
            type: ICalAttendeeType.INDIVIDUAL
          },
          {
            email: student.email,
            name: student.name,
            status: ICalAttendeeStatus.ACCEPTED,
            rsvp: true,
            type: ICalAttendeeType.INDIVIDUAL,
            role: ICalAttendeeRole.REQ,
          },
        ]
      }
    ]
  }).toString()
}

export {sendCreateEmail, sendCancelEmail}
