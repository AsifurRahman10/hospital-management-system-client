'server-only'
import { cache } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const API_URL =
  process.env.NEXT_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:5000'
if (!API_URL) {
  throw new Error(
    'NEXT_API_BASE_URL is not defined in the environment variables'
  )
}
export const getSession = cache(async () => {
  const cookieStore = await cookies()
  const res = await fetch(`${API_URL}/api/v1/auth/get-session`, {
    headers: { cookie: cookieStore.toString() },
    cache: 'no-store'
  })
  if (!res.ok) return null
  return res.json()
})

export async function requireUser() {
  const data = await getSession()

  if (!data) redirect('/login')
  return data
}
