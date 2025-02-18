import { google } from 'googleapis';
import {NextResponse} from "next/server";

const CREDENTIALS = JSON.parse(process.env.GOOGLE_API_CREDENTIALS as string);
const calendarId = process.env.CALENDAR_ID as string;

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const calendar = google.calendar({ version: 'v3' });

const auth = new google.auth.JWT({
    email: CREDENTIALS.client_email,
    key: CREDENTIALS.private_key,
    scopes: SCOPES,
});

const TIMEOFFSET = '+00:00';
// gmt +2 timezone
const TIMEZONE = 'Africa/Johannesburg';

// Get all bookings ( can specify a start and end date )
export async function POST( request: Request ) {
    
    try {
        const {startDate, endDate} = await request.json();
        const response = await calendar.events.list({
            auth: auth,
            calendarId: calendarId,
            timeMin: new Date(`${startDate}T00:00:00${TIMEOFFSET}`).toISOString(),
            timeMax: new Date(`${endDate}T23:59:59${TIMEOFFSET}`).toISOString(),
            timeZone: TIMEZONE,
        });
        return NextResponse.json({bookings: response.data.items});
    } catch (error) {
        console.error('Error:', error);
    }
}

