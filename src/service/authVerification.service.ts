import { cookies } from 'next/headers'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
const SESSION_COOKIE_NAME = 'better-auth.session_token'

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined')
}

const verifySession = async (cookieHeader: string) => {
  if (!cookieHeader) {
    return null
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
    headers: {
      cookie: cookieHeader
    },
    cache: 'no-store'
  })

  if (response.status === 401) {
    return null
  }

  if (!response.ok) {
    throw new Error(
      `Failed to verify user: ${response.status} ${response.statusText}`
    )
  }

  return response.json()
}

export const verifyUserWithToken = async () => {
  const cookieHeader = (await cookies()).toString()
  return verifySession(cookieHeader)
}

export const verifyUserFromRequest = async (request: Request) => {
  return verifySession(request.headers.get('cookie') ?? '')
}

export { SESSION_COOKIE_NAME }
