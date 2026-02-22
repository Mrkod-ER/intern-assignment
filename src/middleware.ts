import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_development_only';
const encodedKey = new TextEncoder().encode(JWT_SECRET);

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('auth_token')?.value;

    const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup');
    const isProtectedRoute = request.nextUrl.pathname.startsWith('/companies') ||
        request.nextUrl.pathname.startsWith('/lists') ||
        request.nextUrl.pathname.startsWith('/saved') ||
        request.nextUrl.pathname.startsWith('/settings');

    if (!token && isProtectedRoute) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (token) {
        try {
            await jwtVerify(token, encodedKey);

            // Redirect authenticated users away from auth pages
            if (isAuthRoute) {
                return NextResponse.redirect(new URL('/companies', request.url));
            }
        } catch (error) {
            // Invalid token
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.delete('auth_token');
            if (isProtectedRoute) return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
