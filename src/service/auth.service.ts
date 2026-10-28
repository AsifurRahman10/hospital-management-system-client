import { cookies } from 'next/headers'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined')
}

export async function verifyUserWithToken() {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.toString()

  if (!cookieHeader) {
    return null
  }

  const res = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
    headers: {
      cookie: cookieHeader
    },
    cache: 'no-store'
  })

  if (!res.ok) {
    throw new Error(`Failed to verify user: ${res.status} ${res.statusText}`)
  }

  return res.json()
}
