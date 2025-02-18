import {NextResponse} from "next/server";
import Booking from "@/models/booking";
import {getSession} from "@/utils/sessionManagment";

export const dynamic = "force-dynamic";

// Get all bookings created within a certain date range
export async function POST( request: Request ) {
    const session = await getSession()
    const user = session.user;
    const studentNumber = user.studentNumber;
    try {
        let {startDate, endDate} = await request.json();
        const bookings = await Booking.find({studentNumber: studentNumber, createdAt: {$gte: startDate, $lte: endDate}});
        return NextResponse.json({bookings});
    } catch (error) {
        console.error('Error:', error);
    }
    return NextResponse.json({error: 'An error occurred'});
}