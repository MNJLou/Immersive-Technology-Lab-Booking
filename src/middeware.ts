import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { updateSession, getSession } from "@/utils/sessionManagment";
export const middleware = async (request: NextRequest) => {

    const session = await getSession();
    
    const url = process.env.NEXT_PUBLIC_URL as string;
    
    if (!session && request.nextUrl.pathname !== '/login') {
        return NextResponse.redirect(url + '/login');
    } else if (session && request.nextUrl.pathname === '/login') {
        return NextResponse.redirect(url);
    } else if (session?.admin && request.nextUrl.pathname !== '/admin') {
        return NextResponse.redirect(url + '/admin');
    }  else if (!session?.admin && request.nextUrl.pathname === '/admin') {
        return NextResponse.redirect(url);
    } 
    
    return await updateSession(request);
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)',],
}
    