import {availableBooking} from "../../libs/interfaces";
import {DEV_PODS, PLAY_PODS, disabledDayTimes} from "../../libs/data";
import {format} from "date-fns";

/**
 * Returns a list of available booking slots and booked slots for a given day.
 * @param bookings
 */
const listAvailableBookings = async (bookings: {
  id: string,
  studentNumber: string,
  startTime: string,
  devBooking: boolean,
  podPreference: number
}[], devBooking: boolean, myStudentNumber: string, podPreference: number, selectedDate: Date) => {
  const availableBookings: availableBooking[] = [];

  // * Goes through each of the 8 time slots in a day and fills the availableBookings array with slots. If the slot is booked, certain variables are set to reflect this. 
  // * For dev bookings, only odd slots are available. i.e. the slots on the hour.
  for (let i = 0; i < 8; i++) {
    if (devBooking && (i % 2 === 1)) continue;
    let slotBookings = bookings.filter(booking => {
      return timeToSlot(booking.startTime) === i
    });
    let myBooking = (slotBookings.filter(booking => booking.studentNumber === myStudentNumber).length > 0);
    let podBooked = devBooking && !myBooking && (podPreference != 0 && slotBookings.filter(booking => booking.podPreference === podPreference).length > 0);
    availableBookings.push({
      id: (myBooking ? slotBookings.filter(booking => booking.studentNumber === myStudentNumber)[0].id : ''),
      booked: podBooked || (devBooking ? slotBookings.length >= DEV_PODS : slotBookings.length >= PLAY_PODS) || disabledDayTimes[toISOStringWithTimezone(selectedDate)]?.includes(slotToTime(i)),
      myBooking: myBooking,
      start: slotToTime(i),
      end: (slotToTime(i).split(":")[1] === "30" || devBooking ? slotToTime(i).split(":")[0] + ":55" : slotToTime(i).split(":")[0] + ":25")
    });
  }
  
  return availableBookings;
};

/**
 * Returns the slot number for a given time.
 * @param time
 */
const timeToSlot = (time: string) => {
  // 9:00 == 0, 9:30 == 1, 10:00 == 2, 10:30 == 3, 11:00 == 4, 11:30 == 5, 13:00 == 6, 13:30 == 7
  const timeArray = time.split(':');
  const hour = parseInt(timeArray[0]);
  const minute = parseInt(timeArray[1]);
  if (hour < 12) {
    return ((hour - 9) * 2) + (minute === 30 ? 1 : 0);
  } else {
    return 6 + (minute === 30 ? 1 : 0);
  }
};

/**
 * Returns a time string for a given slot.
 * @param slot
 */
const slotToTime = (slot: number) => {
  // 0 == 9:00, 1 == 9:30, 2 == 10:00, 3 == 10:30, 4 == 11:00, 5 == 11:30, 6 == 13:00, 7 == 13:30
  let hour = 0;
  if (slot < 6) {
    hour = Math.floor(slot / 2) + 9;
  } else {
    hour = 13;
  }

  const minute = (slot % 2) * 30;
  return `${hour}:${minute === 0 ? '00' : '30'}`;
}

/**
 * Returns a date string in the format 'YYYY-MM-DD' with the timezone.
 * @param date
 */
const toISOStringWithTimezone = (date: Date) => {
  const newDate = new Date(date);
  let month = '' + (newDate.getMonth() + 1);
  let day = '' + newDate.getDate();
  const year = newDate.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [year, month, day].join('-');
}

/**
 * Fetches a list of dates for bookings. Starting from the next available date in the calendar.
 * @param devBooking
 * @param latestDate
 */
const fetchBookingDates = async (devBooking: boolean, latestDate: Date) => {

  const response = await fetch('/api/bookings', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  if (!data.bookings) return [];
  const dates = data.bookings.filter((booking: {
    date: string,
    devBooking: boolean
  }) => new Date(booking.date) >= latestDate && booking.devBooking === devBooking).map((booking: {
    date: string
  }) => format(new Date(booking.date), 'yyyy-MM-dd'));
  return dates;
}

/**
 * Fetches the current user from the session.
 * @returns user
 */
const fetchUserFromSession = async () => {
  const response = await fetch('/api/session/currentUser');
  const data = await response.json();
  return data.user;
}

/**
 * Fetches the bookings for the current week.
 * @returns bookings
 */
const fetchWeeksBookings = async () => {

  let date = new Date();

  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const firstDay = new Date(date.setDate(diff)).setHours(0, 0, 0, 0);
  const lastDay = new Date(date.setDate(diff + 6)).setHours(23, 59, 59, 999);
  
  const response = await fetch('/api/bookings/range', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({startDate: firstDay, endDate: lastDay}),
  });

  // sort bookings into dev and play
  const data = await response.json();
  const bookings = data.bookings;
  const asAvailableBookings = bookings.map((booking: {
    id: string;
    studentNumber: string;
    startTime: string;
    devBooking: boolean;
    podPreference: number;
  }) => {
    return {
      id: booking.id,
      studentNumber: booking.studentNumber,
      startTime: booking.startTime,
      devBooking: booking.devBooking,
      podPreference: booking.podPreference,
    }
  });
  const devBookings = asAvailableBookings.filter((booking: { devBooking: boolean; }) => booking.devBooking);
  const playBookings = asAvailableBookings.filter((booking: { devBooking: boolean; }) => !booking.devBooking);
  return [devBookings, playBookings] as availableBooking[][];
}

/**
 * Creates a booking in the database and in the google calendar, then sends the user an email.
 * @param bookings
 * @param podPreference
 * @param devBooking
 * @param selectedDate
 * @param leftBookings
 */
const makeBooking = async (bookings: {
  start: string;
  end: string
}[], podPreference: number, devBooking: boolean, selectedDate: Date, leftBookings: number) => {
  try {
    if (leftBookings - bookings.length < 0) {
      throw new Error("Too many bookings");
    }
    
    const googleResponse = await fetch(process.env.NEXT_PUBLIC_URL as string + "/api/googleService/bookings/booking", {
      method: "POST",
      headers: {"Content-Type": "application/json",},
      body: JSON.stringify({
        bookings: bookings,
        date: toISOStringWithTimezone(selectedDate),
        devBooking: devBooking,
        podPreference: podPreference === 0 ? "No Preference" : podPreference,
      }),
    }).then(async (response) => {
      if (response.ok) {
        try {
          const data = await response.json();
          const bookingIds = data.bookingIDs as string[];
          let icsUids = data.icsUids as string[];
          if (icsUids.length === 0) {
            icsUids = bookings.map(() => "none");
          }

          const mongoResponse = await fetch(process.env.NEXT_PUBLIC_URL as string + "/api/bookings/booking", {
            method: "POST",
            headers: {"Content-Type": "application/json",},
            body: JSON.stringify({
              eventIds: bookingIds,
              icsUids: icsUids,
              bookings: bookings,
              date: toISOStringWithTimezone(selectedDate).split("T")[0],
              devBooking: devBooking,
              podPreference: podPreference,
            })
          });

        } catch (error) {
          console.error("Error:", error);
        }
      } else {
        console.log("Error:", response);
      }
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

/**
 * Removes a booking from the database and the google calendar, then sends an email to the user, notifying them of the cancellation.
 * @param bookingId
 */
const cancelBooking = async (bookingIds: string[]) => {
  try {
    const response = await fetch('/api/bookings/booking?id=' + bookingIds.map((id) => id).join('&id='), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    const eventIds = data.eventIds as string[];
    const icsUids = data.icsUids as string[];
    const devBooking = data.devBooking as boolean;
    const times = data.times as string[];
    const dates = data.dates as string[];
    const podPreferences = data.podPreferences as number[];
    const googleResponse = await fetch(`/api/googleService/bookings/booking?id=${eventIds.map((id) => id).join('&id=')}&icsUid=${icsUids.map((id) => id).join('&icsUid=')}&time=${times.map((time) => time).join('&time=')}&date=${dates.map((date) => date).join('&date=')}&podPreference=${podPreferences.map((podPreference) => podPreference).join('&podPreference=')}&devBooking=${devBooking}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await googleResponse.json();
  } catch (error) {
    console.error('Error:', error);
  }
}

const fetchAllBookings = async () => {
  try {
    const response = await fetch('/api/bookings/all', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return data.bookings;
  } catch (error) {
    console.error('Error:', error);
  }
}
  
const fetchAllUsers = async () => {
  try {
    const response = await fetch('/api/users/all', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return data.users;
  } catch (error) {
    console.error('Error:', error);
  }
}

/**
 * Merges sequential slots into a single slot.
 * @param bookings
 * @param devBooking
 */
const mergeSequentialSlots = (bookings: availableBooking[], devBooking: boolean) => {

  if(bookings.length === 0) return;
  
  let mergedBookings = [] as availableBooking[];
  mergedBookings.push(({start: bookings[0].start, end: bookings[0].end} as availableBooking));
  let mergeIndex = 1;
  for(let i = 1; i < bookings.length; i++) {
    const slot = timeToSlot(bookings[i].start);
    const prevSlot = timeToSlot(bookings[i - 1].start)
    if(slot - (devBooking ? 2 : 1) === prevSlot && slot !== 6) { // Cannot merge 13:00 slot with 11:30 or 11:00 slot
      mergedBookings[mergeIndex - 1].end = bookings[i].end;
    } else {
      mergedBookings.push({start: bookings[i].start, end: bookings[i].end} as availableBooking)
    }
  }
  
  return mergedBookings;
}

export {
  listAvailableBookings,
  toISOStringWithTimezone,
  fetchBookingDates,
  fetchUserFromSession,
  fetchWeeksBookings,
  cancelBooking,
  makeBooking,
  fetchAllBookings,
  fetchAllUsers
};