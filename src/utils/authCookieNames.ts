export const AUTH_SESSION_COOKIE_NAMES = [
  'better-auth.session_token',
  '__Secure-better-auth.session_token'
] as const

export const isAuthSessionCookieName = (name: string) =>
  AUTH_SESSION_COOKIE_NAMES.includes(
    name as (typeof AUTH_SESSION_COOKIE_NAMES)[number]
  )
