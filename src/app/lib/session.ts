'server-only'
import { cache } from 'react'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined')
}

export const getSession = cache(async () => {
  // 1. Fast path: Check if proxy middleware already verified the session and forwarded user data (0ms)
  try {
    const headerStore = await headers()
    const forwardedUser = headerStore.get('x-user-payload')
    if (forwardedUser) {
      const user = JSON.parse(forwardedUser)
      return { data: { user } }
    }
  } catch {
    // If headers() is unavailable or JSON parse fails, fall through to fetch
  }

  // 2. Fallback path: Direct verification (e.g. Server Actions, direct calls without middleware)
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.toString()
  if (!cookieHeader) return null

  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/auth/get-session`, {
      headers: { cookie: cookieHeader },
      cache: 'no-store'
    })
    if (!res.ok) return null
    return res.json()
  } catch (error) {
    console.error('getSession error:', error)
    return null
  }
})

export async function requireUser() {
  const data = await getSession()
  if (!data?.data?.user) redirect('/login')
  return data
}
