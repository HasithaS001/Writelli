import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the response
  const response = NextResponse.next()

  // Add security headers with very permissive CSP for development and debugging
  const csp = `
    default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;
    script-src * 'unsafe-inline' 'unsafe-eval';
    connect-src * 'unsafe-inline';
    img-src * data: blob: 'unsafe-inline';
    frame-src *;
    style-src * 'unsafe-inline';
    font-src * data:;
  `.replace(/\s+/g, ' ').trim()
  
  response.headers.set('Content-Security-Policy', csp)
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')

  return response
}

// Configure which routes you want the middleware to run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
