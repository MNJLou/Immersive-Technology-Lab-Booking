import User from "@/models/userModel";
import {NextRequest, NextResponse} from "next/server";
import { login } from "@/utils/sessionManagment";
import { connectMongo } from "@/utils/connectDB";
export const dynamic = "force-dynamic";

export async function POST( request: NextRequest, {params}: { params: { studentNumber: string } } ) {
  const { studentNumber } = await params;
  await connectMongo();
  const user = await User.findOne({ studentNumber });
  console.log("STudent Number: " + user);
  if(user !== null) {
      await login(user)
      return NextResponse.json({studentNumber, message: "User logged in successfully"});
  }
  return NextResponse.json({message: "User not found"}, {status: 404});
}