import { verifyUserWithToken } from '@/service/auth.service'
import {
  getRouteOwner,
  isAuthRoute,
  UserRole,
  getDefaultDashboardRoute
} from '@/utils/authUtils'
import { NextRequest, NextResponse } from 'next/server'

export async function proxy(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl
    const routerOwner = getRouteOwner(pathname)
    const isAuth = isAuthRoute(pathname)
    const shouldValidateSession =
      isAuth ||
      routerOwner !== null ||
      pathname === '/verify-email' ||
      pathname === '/reset-password'

    if (!shouldValidateSession) {
      return NextResponse.next()
    }

    const data = await verifyUserWithToken()
    let role: UserRole | null = null
    if (data?.data && data.data.role) {
      role = data.data.role as UserRole
    }

    const unifySuperAdminAndAdminRole = role === 'SUPER_ADMIN' ? 'ADMIN' : role
    role = unifySuperAdminAndAdminRole

    if (isAuth && role) {
      return NextResponse.redirect(
        new URL(getDefaultDashboardRoute(role as UserRole), request.url)
      )
    }

    if (pathname === '/reset-password') {
      const email = request.nextUrl.searchParams.get('email')

      if (email && role) {
        if (data?.data?.needPasswordChange) {
          return NextResponse.next()
        }

        return NextResponse.redirect(
          new URL(getDefaultDashboardRoute(role as UserRole), request.url)
        )
      }

      if (email) {
        return NextResponse.next()
      }

      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    if (!data?.data) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    if (data.data) {
      if (data.data.emailVerified === false) {
        if (pathname !== '/verify-email') {
          const verifyEmailUrl = new URL('/verify-email', request.url)
          verifyEmailUrl.searchParams.set('email', data.data.email)
          return NextResponse.redirect(verifyEmailUrl)
        }

        return NextResponse.next()
      }

      if (data.data.emailVerified && pathname === '/verify-email') {
        return NextResponse.redirect(
          new URL(getDefaultDashboardRoute(role as UserRole), request.url)
        )
      }

      if (data.data.needPasswordChange) {
        if (pathname !== '/reset-password') {
          const resetPasswordUrl = new URL('/reset-password', request.url)
          resetPasswordUrl.searchParams.set('email', data.data.email)
          return NextResponse.redirect(resetPasswordUrl)
        }

        return NextResponse.next()
      }

      if (!data.data.needPasswordChange && pathname === '/reset-password') {
        return NextResponse.redirect(
          new URL(getDefaultDashboardRoute(role as UserRole), request.url)
        )
      }
    }

    if (routerOwner === 'COMMON') {
      return NextResponse.next()
    }

    if (
      routerOwner === 'ADMIN' ||
      routerOwner === 'DOCTOR' ||
      routerOwner === 'PATIENT'
    ) {
      if (routerOwner !== role) {
        return NextResponse.redirect(
          new URL(getDefaultDashboardRoute(role as UserRole), request.url)
        )
      }
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Error in proxy middleware:', error)

    const { pathname } = request.nextUrl
    const routerOwner = getRouteOwner(pathname)
    const isAuth = isAuthRoute(pathname)
    const shouldValidateSession =
      isAuth ||
      routerOwner !== null ||
      pathname === '/verify-email' ||
      pathname === '/reset-password'

    if (shouldValidateSession) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
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
