import { syncResponseCookies } from '@/utils/authCookies'
import { NextRequest, NextResponse } from 'next/server'

const getSafeRedirectPath = (path: string | null): string => {
  if (path && path.startsWith('/') && !path.startsWith('//')) {
    return path
  }
  return '/dashboard'
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  const safeRedirect = getSafeRedirectPath(
    request.nextUrl.searchParams.get('redirect')
  )

  const loginFallbackUrl = new URL('/login', request.url)
  loginFallbackUrl.searchParams.set('redirect', safeRedirect)
  loginFallbackUrl.searchParams.set('authError', 'google_login_failed')

  const apiUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL

  if (!token || !apiUrl) {
    return NextResponse.redirect(loginFallbackUrl)
  }

  try {
    const verifyUrl = new URL('/api/auth/one-time-token/verify', apiUrl)
    const backendResponse = await fetch(verifyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
      cache: 'no-store'
    })

    if (!backendResponse.ok) {
      return NextResponse.redirect(loginFallbackUrl)
    }

    const setCookies = backendResponse.headers.getSetCookie()
    if (!setCookies.length) {
      return NextResponse.redirect(loginFallbackUrl)
    }

    const response = NextResponse.redirect(new URL(safeRedirect, request.url))
    await syncResponseCookies(setCookies, response.cookies)
    return response
  } catch (error) {
    console.error('Google OAuth callback failed:', error)
    return NextResponse.redirect(loginFallbackUrl)
  }
}
