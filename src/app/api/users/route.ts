import User from "@/models/userModel";
import { connectMongo } from "@/utils/connectDB";
import { NextResponse } from "next/server";

// Used to create a new user
export async function POST( request: Request ) {
    try {
        const {studentNumber: studentNumber, name: name, surname: surname, degree: degree, yearOfStudy: yearOfStudy, email: email} = await request.json();
        await connectMongo();
        await User.create({studentNumber, name, surname, degree, yearOfStudy, email});
        return NextResponse.json({studentNumber, message: "User logged in successfully"}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: "Something went wrong"}, {status: 500});
    }
}


