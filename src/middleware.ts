import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export { default } from "next-auth/middleware"

// Middleware to protect routes based on token presence
export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request })
    const url = request.nextUrl

    // Redirect logged-in users away from the login page
    if (token && url.pathname === '/login') {
        return NextResponse.redirect(new URL('/home', request.url))
    }

    // Redirect unauthenticated users to login page for protected routes
    if (!token && !url.pathname.startsWith('/login')) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Allow request to proceed
    return NextResponse.next()
}

// Protect these routes with middleware
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
        '/login' // Include login route to apply middleware
    ],
}
