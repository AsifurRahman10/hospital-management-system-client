export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'DOCTOR' | 'PATIENT'

export type RouteConfig = {
  exact: string[]
  pattern: RegExp[]
}

export const commonProtectedRoutes: RouteConfig = {
  exact: ['/my-profile', '/change-password'],
  pattern: []
}

export const doctorProtectedRoutes: RouteConfig = {
  pattern: [/^\/doctor\/dashboard/], // Matches any path that starts with /doctor/dashboard
  exact: []
}

export const adminProtectedRoutes: RouteConfig = {
  pattern: [/^\/admin\/dashboard/], // Matches any path that starts with /admin/dashboard
  exact: []
}

export const patientProtectedRoutes: RouteConfig = {
  pattern: [/^\/dashboard/], // Matches any path that starts with /dashboard
  exact: ['/payment/success']
}

export const authRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email'
]

export const isAuthRoute = (pathname: string) => {
  return authRoutes.some((router: string) => router === pathname)
}

export const isRouterMatches = (pathname: string, routes: RouteConfig) => {
  if (routes.exact.includes(pathname)) {
    return true
  }

  return routes.pattern.some((pattern: RegExp) => pattern.test(pathname))
}

export const getRouteOwner = (
  pathname: string
): 'SUPER_ADMIN' | 'ADMIN' | 'DOCTOR' | 'PATIENT' | 'COMMON' | null => {
  if (isRouterMatches(pathname, doctorProtectedRoutes)) {
    return 'DOCTOR'
  }
  if (isRouterMatches(pathname, adminProtectedRoutes)) {
    return 'ADMIN'
  }

  if (isRouterMatches(pathname, patientProtectedRoutes)) {
    return 'PATIENT'
  }

  if (isRouterMatches(pathname, commonProtectedRoutes)) {
    return 'COMMON'
  }

  return null
}

export const getDefaultDashboardRoute = (role: UserRole) => {
  if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
    return '/admin/dashboard'
  }
  if (role === 'DOCTOR') {
    return '/doctor/dashboard'
  }
  if (role === 'PATIENT') {
    return '/dashboard'
  }

  return '/'
}
