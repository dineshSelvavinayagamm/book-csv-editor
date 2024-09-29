import { type NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const user = true;
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  if (user && request.nextUrl.pathname.includes('login')) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!login|api|_next|static).*)'],
};
