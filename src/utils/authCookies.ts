import { cookies } from 'next/headers'

const SESSION_COOKIE_NAME = 'better-auth.session_token'
type SetCookieHeader = string | string[] | undefined

const getSetCookieHeaders = (header: SetCookieHeader) => {
  if (Array.isArray(header)) {
    return header
  }

  return header ? [header] : []
}

export const syncResponseCookies = async (header: SetCookieHeader) => {
  const setCookieHeaders = getSetCookieHeaders(header)

  if (setCookieHeaders.length === 0) {
    return
  }

  const cookieStore = await cookies()

  for (const cookie of setCookieHeaders) {
    const [nameValue, ...attributes] = cookie.split(';')
    const separatorIndex = nameValue.indexOf('=')

    if (separatorIndex < 1) {
      continue
    }

    const name = nameValue.slice(0, separatorIndex).trim()
    const value = nameValue.slice(separatorIndex + 1).trim()

    if (name !== SESSION_COOKIE_NAME) {
      continue
    }

    const options: Parameters<typeof cookieStore.set>[2] = {}

    for (const attribute of attributes) {
      const [rawKey, ...rawValue] = attribute.trim().split('=')
      const key = rawKey.toLowerCase()
      const value = rawValue.join('=').trim()

      if (key === 'path' && value) options.path = value
      if (key === 'domain' && value) options.domain = value
      if (key === 'max-age' && value) options.maxAge = Number(value)
      if (key === 'expires' && value) options.expires = new Date(value)
      if (key === 'secure') options.secure = true
      if (key === 'httponly') options.httpOnly = true
      if (
        key === 'samesite' &&
        ['lax', 'strict', 'none'].includes(value.toLowerCase())
      ) {
        options.sameSite = value.toLowerCase() as 'lax' | 'strict' | 'none'
      }
    }

    cookieStore.set(name, value, options)
  }
}
