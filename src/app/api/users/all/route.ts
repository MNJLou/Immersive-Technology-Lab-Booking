import {NextResponse} from "next/server";
import User from "@/models/userModel";
import { connectMongo } from "@/utils/connectDB";

export const dynamic = "force-dynamic";
export async function GET() {
  try {
    await connectMongo();
    const users = await User.find({});
    return NextResponse.json({users});
  } catch (error) {
    console.error('Error:', error);
  }
  return NextResponse.json({message: "Something went wrong while fetching users"}, {status: 500});
}