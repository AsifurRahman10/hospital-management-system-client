import { cookies } from 'next/headers'

type SetCookieHeader = string | string[] | undefined

export const syncResponseCookies = async (header: SetCookieHeader) => {
  const setCookieHeaders = Array.isArray(header)
    ? header
    : header
      ? [header]
      : []

  if (!setCookieHeaders.length) return

  const cookieStore = await cookies()

  for (const cookie of setCookieHeaders) {
    const [nameValue, ...attributes] = cookie.split(';')
    const separatorIndex = nameValue.indexOf('=')

    if (separatorIndex < 1) continue

    const name = nameValue.slice(0, separatorIndex).trim()
    const rawValue = nameValue.slice(separatorIndex + 1).trim()

    // Decode the cookie value once
    let value = rawValue

    try {
      value = decodeURIComponent(rawValue)
    } catch {
      value = rawValue
    }

    const options: {
      path: string
      httpOnly: boolean
      secure: boolean
      sameSite: 'lax' | 'strict' | 'none'
      maxAge?: number
      expires?: Date
    } = {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    }

    for (const attribute of attributes) {
      const [key, ...parts] = attribute.trim().split('=')
      const attributeValue = parts.join('=').trim()

      switch (key.toLowerCase()) {
        case 'path':
          options.path = attributeValue || '/'
          break

        case 'max-age':
          options.maxAge = Number(attributeValue)
          break

        case 'expires':
          options.expires = new Date(attributeValue)
          break

        case 'httponly':
          options.httpOnly = true
          break

        case 'secure':
          options.secure = true
          break

        case 'samesite':
          if (
            ['lax', 'strict', 'none'].includes(attributeValue.toLowerCase())
          ) {
            options.sameSite = attributeValue.toLowerCase() as
              | 'lax'
              | 'strict'
              | 'none'
          }
          break
      }
    }

    await cookieStore.set(name, value, options)
  }
}
