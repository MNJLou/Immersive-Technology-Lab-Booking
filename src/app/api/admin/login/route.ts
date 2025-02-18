import Admin from "@/models/admin";
import {connectMongo, closeClient} from "@/utils/connectDB";
import {NextResponse} from "next/server";
import { loginAdmin } from "@/utils/sessionManagment";
import { comparePassword } from "@/utils/auth";

// Gets the admin username and password from the request body and checks if it matches the admin username and password in the database
export async function POST( request: Request ) {
        try {
            const {username, password} = await request.json();
            await connectMongo();
            const admin = await Admin.findOne({username});
            const correctPassword = await comparePassword(password, admin?.password);
            if (correctPassword) {
                await loginAdmin(admin);
                return NextResponse.json({message: "Admin logged in successfully"}, {status: 200});
            } else {
                return NextResponse.json({message: "Incorrect Password"}, {status: 401});
            }
        } catch (error) {
            await closeClient();
            return NextResponse.json({message: "Something went wrong"}, {status: 500});
        }
}