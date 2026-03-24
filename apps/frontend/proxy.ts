import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/login']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('auth_token')?.value

  const isPublic = PUBLIC_ROUTES.includes(pathname)

  // Not logged in → trying to access protected route → redirect to login
  if (!token && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Already logged in → trying to access login → redirect to home
  if (token && isPublic) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
