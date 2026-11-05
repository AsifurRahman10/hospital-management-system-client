import { UserStatus } from '@/types/user.types'

export interface IPatient {
  id: string | number
  name: string
  email: string
  profilePhoto?: string | null
  contactNumber?: string | null
  createdAt: string | Date
  user: {
    id: string
    status: UserStatus
  }
}
