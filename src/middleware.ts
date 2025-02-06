import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/signin', '/kayit-ol', '/about','/','/unauthorized','/logout','/danisman/kayit-ol','/psikoloji','/danisman/*']; // Define public routes
const roleBasedRoutes = {
    admin: ['/admin'],
    consultant: ['/consultant'],
    client: ['/client'],
};

export default async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;

    // Public route handling
    if (publicRoutes.some(route => pathname === route)) {
        return NextResponse.next();
    }
    // Redirect unauthenticated users to the sign-in page
    if (!token) {
        if (pathname !== '/signin') {
            // Redirect only if not already on the sign-in page
            return NextResponse.redirect(new URL('/signin', req.url));
        }
    }
    // Role-based access control
    // @ts-ignore
    const userRole = token?.user?.role as 'admin' | 'consultant' | 'client';
    // Check if the user's role grants access to the route
    const allowedRoutes = roleBasedRoutes[userRole] || [];
    const isAuthorized = allowedRoutes.some((route) => pathname.startsWith(route));

    if (!isAuthorized) {
        // Redirect unauthorized users to an error page
        return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next|.*\\..*).*)'], // Match all routes except API, static files, and Next.js assets
};
