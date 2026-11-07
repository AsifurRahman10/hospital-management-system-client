import { NextRequest, NextResponse } from 'next/server'

import {
  getRouteOwner,
  isAuthRoute,
  UserRole,
  getDefaultDashboardRoute
} from '@/utils/authUtils'
import { requireUser } from '@/app/lib/session'

const SESSION_COOKIE_NAME = 'better-auth.session_token'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const routerOwner = getRouteOwner(pathname)
  const isAuth = isAuthRoute(pathname)

  // Public non-auth route: allow immediately without session verification
  if (!isAuth && routerOwner === null) {
    return NextResponse.next()
  }

  const hasSessionCookie = request.cookies
    .getAll()
    .some(({ name }) => name === SESSION_COOKIE_NAME)

  // Optimization 1: On auth routes (/login, /register), if no session cookie exists, allow immediately (0ms)
  if (isAuth && !hasSessionCookie) {
    return NextResponse.next()
  }

  // Optimization 2: On protected routes, if no session cookie exists, redirect immediately to login (0ms)
  if (!isAuth && !hasSessionCookie) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname + request.nextUrl.search)
    return NextResponse.redirect(loginUrl)
  }

  try {
    // Verify session once with backend using the request's cookies
    const data = await requireUser()
    const user = data?.data?.user
    const role = user?.role as UserRole | undefined

    if (!data?.data || !role) {
      if (isAuth) {
        return NextResponse.next()
      }

      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname + request.nextUrl.search)
      return NextResponse.redirect(loginUrl)
    }

    const normalizedRole: UserRole = role === 'SUPER_ADMIN' ? 'ADMIN' : role

    // Authenticated user trying to access /login, /register, etc. -> redirect to dashboard
    if (isAuth) {
      return NextResponse.redirect(
        new URL(getDefaultDashboardRoute(normalizedRole), request.url)
      )
    }

    // Common protected routes (e.g., /my-profile, /change-password) accessible to all authenticated roles
    if (routerOwner === 'COMMON') {
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-payload', JSON.stringify(user))

      return NextResponse.next({
        request: {
          headers: requestHeaders
        }
      })
    }

    // Role-based access control check
    if (
      ['ADMIN', 'DOCTOR', 'PATIENT'].includes(routerOwner ?? '') &&
      routerOwner !== normalizedRole
    ) {
      return NextResponse.redirect(
        new URL(getDefaultDashboardRoute(normalizedRole), request.url)
      )
    }

    // Optimization 3: Forward the verified user data via request headers to Server Components.
    // Downstream components (like AppSidebar and Pages) can read this in 0ms with zero duplicate HTTP calls.
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-payload', JSON.stringify(user))

    return NextResponse.next({
      request: {
        headers: requestHeaders
      }
    })
  } catch (error) {
    console.error('Authentication verification failed:', error)

    return NextResponse.json(
      { message: 'Authentication service temporarily unavailable' },
      { status: 503 }
    )
  }
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/dashboard/:path*',
    '/admin/:path*',
    '/doctor/:path*',
    '/my-profile',
    '/change-password',
    '/payment/success'
  ]
}
