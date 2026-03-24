import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/login']
const ONBOARDING_ROUTE = '/onboarding'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('auth_token')?.value
  const isPublic = PUBLIC_ROUTES.includes(pathname)

  // Not logged in → redirect to login (except public routes)
  if (!token && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (token) {
    // Parse user from cookie to check onboarding status
    const userCookie = request.cookies.get('auth_user')?.value
    if (userCookie) {
      try {
        const user = JSON.parse(decodeURIComponent(userCookie)) as {
          firstAccess?: boolean
          onboardingComplete?: boolean
        }

        const needsOnboarding = user.firstAccess === true || user.onboardingComplete === false

        // First access → force onboarding (unless already there)
        if (needsOnboarding && pathname !== ONBOARDING_ROUTE) {
          return NextResponse.redirect(new URL(ONBOARDING_ROUTE, request.url))
        }

        // Onboarding done → can't go back to onboarding
        if (!needsOnboarding && pathname === ONBOARDING_ROUTE) {
          return NextResponse.redirect(new URL('/', request.url))
        }
      } catch {
        // Malformed cookie — let it pass, client will handle
      }
    }

    // Already logged in → can't access login
    if (isPublic) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
