import {NextRequest, NextResponse} from "next/server";
import {getSession} from "@/utils/sessionManagment";

export const dynamic = "force-dynamic";
// Used to fetch a user by from the session
export async function GET( request: NextRequest ) { 
    try {
        const session = await getSession();
        const admin = session.admin;
        return NextResponse.json({admin});
    } catch (error) {
        console.error("Error:", error);
    }
    return NextResponse.json({message: "Something went wrong while fetching the user"}, {status: 500});
}