import { NextRequest, NextResponse } from 'next/server'
import { verifyUserWithToken } from '@/service/auth.service'
import {
  getRouteOwner,
  isAuthRoute,
  UserRole,
  getDefaultDashboardRoute
} from '@/utils/authUtils'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const routerOwner = getRouteOwner(pathname)
  const isAuth = isAuthRoute(pathname)

  if (!isAuth && routerOwner === null) {
    return NextResponse.next()
  }

  const hasSessionCookie = request.cookies
    .getAll()
    .some(({ name }) => name.includes('session_token'))

  if (isAuth && !hasSessionCookie) {
    return NextResponse.next()
  }

  try {
    const data = await verifyUserWithToken()

    const role = data?.data?.role as UserRole | undefined

    if (!data?.data || !role) {
      if (isAuth) {
        return NextResponse.next()
      }

      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname + request.nextUrl.search)

      return NextResponse.redirect(loginUrl)
    }

    const normalizedRole: UserRole = role === 'SUPER_ADMIN' ? 'ADMIN' : role

    if (isAuth) {
      return NextResponse.redirect(
        new URL(getDefaultDashboardRoute(normalizedRole), request.url)
      )
    }

    if (routerOwner === 'COMMON') {
      return NextResponse.next()
    }

    if (
      ['ADMIN', 'DOCTOR', 'PATIENT'].includes(routerOwner ?? '') &&
      routerOwner !== normalizedRole
    ) {
      return NextResponse.redirect(
        new URL(getDefaultDashboardRoute(normalizedRole), request.url)
      )
    }

    return NextResponse.next()
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
