import { IAdmin } from '@/types/admin.types'
import { IDoctor } from '@/types/doctor.types'
import { IPatient } from '@/types/patient.types'

export interface IDoctorProfile extends IDoctor {
  _count: {
    appointments: number
    reviews: number
  }
}
export interface PatientProfile extends IPatient {
  _count: {
    appointments: number
  }
}
export interface IProfile {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image?: string
  role: string
  status: string
  needPasswordChange: boolean
  isDeleted: boolean
  deletedAt: Date | null
  createdAt: string
  updatedAt: string
  patient?: PatientProfile | null
  doctor?: IDoctorProfile | null
  admin?: IAdmin | null
}
