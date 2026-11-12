import { getSafeRedirectPath } from '@/utils/authUtils'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const safeRedirect = getSafeRedirectPath(
    request.nextUrl.searchParams.get('redirect')
  )

  const apiUrl =
    process.env.NEXT_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL

  if (!apiUrl) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', safeRedirect)
    loginUrl.searchParams.set('authError', 'google_login_failed')
    return NextResponse.redirect(loginUrl)
  }

  let frontendOrigin = request.nextUrl.origin
  const requestedOrigin = request.nextUrl.searchParams.get('origin')
  if (requestedOrigin) {
    try {
      frontendOrigin = new URL(requestedOrigin).origin
    } catch {
      frontendOrigin = request.nextUrl.origin
    }
  }

  const googleLoginUrl = new URL('/api/v1/auth/login/google', apiUrl)
  googleLoginUrl.searchParams.set('redirect', safeRedirect)
  googleLoginUrl.searchParams.set('origin', frontendOrigin)

  return NextResponse.redirect(googleLoginUrl)
}
