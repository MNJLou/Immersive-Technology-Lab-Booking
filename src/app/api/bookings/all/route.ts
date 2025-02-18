import {NextResponse} from "next/server";
import Booking from "@/models/booking";
import { connectMongo } from "@/utils/connectDB";

export const dynamic = "force-dynamic";

// Get all bookings after a certain date (optional)
export async function POST( request: Request ) {
    try {
        await connectMongo();
        let {date, endDate} = await request.json();
        const bookings = date ? endDate ? await Booking.find({date: {$gte: date, $lte: endDate}}) : await Booking.find({date: {$gte: date}}) : endDate ? await Booking.find({date: {$lte: endDate}}) : await Booking.find({});
        return NextResponse.json({bookings});
    } catch (error) {
        console.error('Error:', error);
    }
    return NextResponse.json({message: "Something went wrong while fetching bookings"}, {status: 500});
}

export async function GET() {
    try {
        await connectMongo();
        const bookings = await Booking.find({}).lean();
        return NextResponse.json({bookings});
    } catch (error) {
        console.error('Error:', error);
    }
    return NextResponse.json({message: "Something went wrong while fetching bookings"}, {status: 500});
}