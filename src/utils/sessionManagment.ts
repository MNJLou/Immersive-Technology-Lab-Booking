import { SignJWT, jwtVerify} from "jose";
import {cookies} from "next/headers";
import {NextRequest, NextResponse} from "next/server";

const key = new TextEncoder().encode(process.env.JWT_SECRET)

/**
 * Encrypts a payload
 * @param payload
 * @returns token
 */
export const encrypt = async (payload: any) => {
 return await new SignJWT(payload)
     .setProtectedHeader({alg: "HS256"})
     .setIssuedAt()
     .setIssuer("itl-booking-app")
     .setExpirationTime("5h")
     .sign(key);}

/**
 * Decrypts a token
 * @param token
 * @returns payload
 */
export const decrypt = async (token: string): Promise<any> => {
    const {payload} = await jwtVerify(token, key, {algorithms: ["HS256"]});
    return payload;
}

/**
 * Gets the session cookie
 * @returns session
 */
export const getSession = async () => {
    const CookieStore = await cookies();
    const session = CookieStore.get("itl-booking-app-session")?.value;
    if(!session) return null;
    return await decrypt(session);
}

/**
 * Updates the session cookie
 * @param request
 */
export const updateSession = async (request: NextRequest) => {
    const session = request.cookies.get("itl-booking-app-session")?.value;
    if(!session) {
        console.log("No session found");
        return;
    }
    
    const parsed = await decrypt(session);
    parsed.expires = new Date(Date.now() + 3600 * 1000 * 5); // * 5 hours
    const res = NextResponse.next();
    res.cookies.set({
        name: 'itl-booking-app-session',
        value: await encrypt(parsed),
        httpOnly: true,
        expires: parsed.expires,
        sameSite: "strict"
    });
    return res;
}

/**
 * Logs in a user by creating a session cookie with the user's details
 * @param user
 */
export const login = async ( user: {studentNumber: string, name: string, surname: string, degree: string, yearOfStudy: number, email: string}) => {
    const expires = new Date(Date.now() + 3600 * 1000 * 5); // * 5 hours
    const session = await encrypt({ user, expires });
    const CookieStore = await cookies();
    CookieStore.set("itl-booking-app-session", session, {expires, httpOnly: true, sameSite: "strict", path: "/"});
}

/**
 * Logs out a user by destroying the session cookie
 */
export const logout = async () => {
    // destroy the session
    const CookieStore = await cookies();
    CookieStore.set("itl-booking-app-session", "", {expires: new Date(0), httpOnly: true, sameSite: "strict", path: "/"});
}

/**
 * Logs in an admin by creating a session cookie with the admin's details
 * @param admin
 */
export const loginAdmin = async (admin: {username: string}) => {
    const expires = new Date(Date.now() + 3600 * 1000 * 5); // * 5 hours
    const session = await encrypt({admin, expires});
    const CookieStore = await cookies();
    CookieStore.set("itl-booking-app-session", session, {expires, httpOnly: true, sameSite: "strict", path: "/"});
}
    
    
