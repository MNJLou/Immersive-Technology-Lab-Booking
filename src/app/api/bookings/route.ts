import { connectMongo } from "@/utils/connectDB";
import {NextResponse} from "next/server";
import Booking from "@/models/booking";
import { getSession } from "@/utils/sessionManagment";

// Get all bookings can specify a date and if it is a dev booking. Returns student number for comparing with my-booking attr of each booking 
export async function POST( request: Request ) {
    try {
        const user = await getSession();
        const studentNumber = user.user.studentNumber;
        const {date, devBooking} = await request.json();
        await connectMongo();
        const bookings = await Booking.find({date: date, devBooking: devBooking})
        return NextResponse.json({bookings, studentNumber});
    } catch (error) {
        console.error('Error:', error);
    }
    return NextResponse.json({message: "Something went wrong while getting bookings"}, {status: 500});
}

// Get all bookings for the user
export async function GET( request: Request ) {
    try {
        const user = await getSession();
        if(!user) {
            return NextResponse.json({message: "User not logged in"}, {status: 401});
        }
        const studentNumber = user.user.studentNumber;
        await connectMongo();
        const bookings = await Booking.find({studentNumber: studentNumber})
        return NextResponse.json({bookings});
    } catch (error) {
        console.error('Error:', error);
    }
    return NextResponse.json({message: "Something went wrong while getting bookings"}, {status: 500});
}