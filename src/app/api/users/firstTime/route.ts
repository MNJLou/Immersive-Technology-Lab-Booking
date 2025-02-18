// Check all provided users to see if they have booked before.

import {connectMongo} from "@/utils/connectDB";
import Booking from "@/models/booking";
import {NextResponse} from "next/server";

export const dynamic = "force-dynamic";
export async function POST(request: Request ) {
  try {
    const {studentNumbers} = await request.json();
    await connectMongo();
    let firstTimeUsers = [] as string[];
    for (const studentNumber of studentNumbers) {
      const bookings = await Booking.find({studentNumber, date: {$lt: new Date().toISOString().split("T")[0]}});
      if(bookings.length === 0) {
        firstTimeUsers.push(studentNumber);
      }
    }
    return NextResponse.json({firstTimeUsers}, {status: 200});
  } catch (error) {
    return NextResponse.json({message: "Something went wrong"}, {status: 500});
  }
}