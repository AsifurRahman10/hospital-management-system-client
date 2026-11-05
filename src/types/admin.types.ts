import { UserRole, UserStatus } from '@/types/user.types'

export interface IAdmin {
  id: string | number
  name: string
  email: string
  profilePhoto?: string
  contactNumber?: string
  user: {
    id: string
    name: string
    email: string
    role: UserRole.ADMIN | UserRole.SUPER_ADMIN
    status: UserStatus
  }
  createdAt: string | Date
}

export interface IUpdateAdminPayload {
  name?: string
  contactNumber?: string
}

export interface ICreateAdminPayload {
  password: string
  admin: {
    name: string
    email: string
    contactNumber: string
  }
}

export interface ICreateSuperAdminPayload {
  password: string
  superAdmin: {
    name: string
    email: string
    contactNumber: string
  }
}
