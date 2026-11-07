export interface ILoginResponse {
  token: string
  user: {
    needPasswordChange: boolean
    email: string
    name: string
    role: string
    image: string
    status: string
    isDeleted: boolean
    emailVerified: boolean
  }
}

export interface ILogoutResponse {
  success: boolean
  message: string
  data: null
}
