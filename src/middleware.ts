import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export { default } from "next-auth/middleware"

// checking route with token
export async function middleware(request: NextRequest) {
    const token = await getToken({req: request})
    const url = request.nextUrl

    if(token && (url.pathname.startsWith('/login') || url.pathname === '/') ){
        return NextResponse.redirect(new URL('/home', request.url))
    }else if(!token){
        return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next();
}

// auth logic applies on these routes  and protected routes
export const config = {
    matcher: [
        '/',
        '/home',
        '/budget',
        '/donors',
        '/departments',
        '/cost-centers', 
        '/expenses',
        '/staff',
        '/login',
    ],
}