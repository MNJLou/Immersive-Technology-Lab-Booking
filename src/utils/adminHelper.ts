import {toISOStringWithTimezone} from "@/utils/bookingsHelper";
import { booking } from "../../libs/interfaces";

/**
 * Fetches the current admin from the session.
 * @returns admin
 */
const fetchAdminFromSession = async () => {
    const response = await fetch('/api/session/currentAdmin');
    const data = await response.json();
    return data.admin;
}

/**
 * Fetches all bookings for the current day.
 * @param date
 * @returns bookings
 */
const fetchBookingsToday = async (date: Date = new Date()) => {
    const response = await fetch(process.env.NEXT_PUBLIC_URL as string + "/api/bookings/all", {
        method: "POST",
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify({date: toISOStringWithTimezone(date).split("T")[0], endDate: toISOStringWithTimezone(date).split("T")[0]}), 
    });
    
    const data = await response.json();
    let bookings = data.bookings;
    
    // Sort bookings by time
    bookings.sort((a : any, b : any) => {
        return parseInt(a.time.slice(0, 2)) - parseInt(b.time.slice(0, 2));
    });
    
    // if the date is today, only show bookings that are in the future
    if (date.toDateString() === new Date().toDateString()) {
        const currentTime = new Date().getHours();
        bookings = bookings.filter((booking : any) => {
            return parseInt(booking.time.slice(0, 2)) >= currentTime;
        });
    }
    return bookings;
}

/**
 * Returns a list of users who have booked for the first time.
 * @param bookings
 * @returns firstTimeUsers
 */
const getFirstTimeUsers = async (bookings: booking[]) => {
    const users = bookings.map((booking) => booking.studentNumber);
    const uniqueUsers = users.filter((user, index) => users.indexOf(user) === index);
    const response = await fetch(process.env.NEXT_PUBLIC_URL as string + "/api/users/firstTime", {
        method: "POST",
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify({studentNumbers: uniqueUsers}),
    });
    const data = await response.json();
    return data.firstTimeUsers;
}

const dateNameMonthDay = (date: Date) => {
    // e.g. Friday, 1st January
    return date.toLocaleDateString('en-GB', {weekday: 'long', day: 'numeric', month: 'long'});
}

export { fetchAdminFromSession, fetchBookingsToday, dateNameMonthDay, getFirstTimeUsers };