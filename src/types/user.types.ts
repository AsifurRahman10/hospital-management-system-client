// export type UserRole = "ADMIN" | "SUPERADMIN" | 'DOCTOR' | 'PATIENT'
export enum UserRole {
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
  DOCTOR = 'DOCTOR',
  PATIENT = 'PATIENT'
}

export interface IChangeUserStatusPayload {
  userId: string
  userStatus: UserStatus
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  BLOCK = 'BLOCK',
  DELETED = 'DELETED'
}

export interface IChangeUserRolePayload {
  userId: string
  role: UserRole
}

export interface IUpdatedUser {
  id: string
  name?: string | null
  email?: string | null
  role: UserRole
  status: UserStatus
}
