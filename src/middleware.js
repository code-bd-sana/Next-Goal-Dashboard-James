import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function middleware(req) {
  const { pathname } = req.nextUrl;


  const publicPaths = ['/signin', '/signup', '/api/auth', '/public'];


  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }


  const token = await getToken({ 
    req, 
    secret: "aidfjnvociydfnovfadf",
    secureCookie: process.env.NODE_ENV === 'production'
  });




  if (!token) {
    const signinUrl = new URL('/signin', req.url);
    return NextResponse.redirect(signinUrl);
  }


 
  return NextResponse.next();

}

export const config = {
  matcher: [
    '/',
    '/profile',
    '/select-coaches',
    '/subscription-details',
    '/payment-history',
    '/users',
    '/send-email',
    '/select-coaches',
    '/template',
    '/create-email',
    '/coach',
    
    
  ],
};
