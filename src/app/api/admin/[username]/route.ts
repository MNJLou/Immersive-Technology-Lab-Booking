import { connectMongo } from "@/utils/connectDB";
import User from "@/models/userModel";
import {NextRequest, NextResponse} from "next/server";

// Used to fetch a user based on username (student number) and check if they are an admin
export async function POST( request: NextRequest, 
    context: any 
) {
    
    const { params } = context;
    const username = params.username;
    await connectMongo();
    // studentNumber: username
    const admin = await User.findOne( { studentNumber: username, isAdmin: true } );
    const isAdmin = admin ? true : false;
    return NextResponse.json(isAdmin);
}