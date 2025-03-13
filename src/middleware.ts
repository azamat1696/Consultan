import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
const publicRoutes = ['/signin','/sifre-sifirla','/arama','/sifremi-unuttum','/kayit-ol', '/about','/','/unauthorized','/logout','/danisman/kayit-ol','/psikoloji','/danisman/*','/kategoriler/*','/nasil-calisiyor','/hakkimizda','/api']; // Define public routes
const roleBasedRoutes = {
    admin: ['/admin'],
    consultant: ['/consultant'],
    client: ['/client'],
};

export default async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    const { pathname } = req.nextUrl;
    const pathnameArray = pathname.split('/');
    const pathnameArrayWithoutSlash = pathnameArray.filter(p => p !== '');
    // check if public routes
    if (publicRoutes.some(route => route.split('/').filter(p => p !== '').join('/').includes(pathnameArrayWithoutSlash[0])) || publicRoutes.some(route => route === pathname)) {
        return NextResponse.next();
    }
    
     // check if pathname includes after slash star the acsept rest of route for example /kategoriler/psikoloji/* or /kategoriler/* and check if it is public route
    //if (isPublicRoute(pathname)) {
    //    return NextResponse.next();
    //}
    // Redirect unauthenticated users to the sign-in page
    if (!token) {
        if (pathname !== '/signin') {
            // Redirect only if not already on the sign-in page
            return NextResponse.redirect(new URL('/signin', req.url));
        }
    }
    // Role-based access control
    // @ts-ignore
    const userRole = token?.role as 'admin' | 'consultant' | 'client';
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
