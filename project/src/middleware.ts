import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const session = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Check if the path is one of the protected routes
  const path = request.nextUrl.pathname;
  const isProtectedRoute = 
    path.startsWith('/dashboard') || 
    path.startsWith('/trials') || 
    path.startsWith('/observations') || 
    path.startsWith('/navigation') || 
    path.startsWith('/activity') ||
    path.startsWith('/admin');
  
  // If it's a protected route and no session exists, redirect to signin
  if (isProtectedRoute && !session) {
    const url = new URL('/auth/signin', request.url);
    url.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(url);
  }

  // Check admin routes
  if (path.startsWith('/admin') && session) {
    const userRole = (session as any).role || 'user';
    
    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/trials/:path*', 
    '/observations/:path*',
    '/navigation/:path*',
    '/activity/:path*',
    '/admin/:path*',
  ],
};