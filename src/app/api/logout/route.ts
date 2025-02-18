import { NextRequest, NextResponse } from 'next/server';
import { logout } from "@/utils/sessionManagment";

export const dynamic = "force-dynamic";
export async function POST( request: NextRequest ) {
    await logout();
    return NextResponse.json({message: "User logged out successfully"}, {status: 200});
}

export async function GET( request: NextRequest ) {
    // return empty response
    return NextResponse.json({});
}