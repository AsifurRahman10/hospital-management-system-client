import { UserStatus } from '@/types/user.types'

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export interface IDoctor {
  id: number
  name: string
  email: string
  profilePhoto?: string
  contactNumber?: string
  address?: string
  registrationNumber: string
  experience?: number
  gender: Gender
  appointmentFee: number
  qualifications: string
  currentWorkplace: string
  designation: string
  averageRating: number
  createdAt: Date
  user: {
    id: string
    status: UserStatus
  }
  doctorSpecialties: Array<{
    specialtyId: string
    doctorId: string
    specialty: {
      id: string
      title: string
      icon: string
    }
  }>
}

export interface ICreateDoctorPayload {
  password: string
  doctor: {
    name: string
    email: string
    contactNumber: string
    address?: string
    registrationNumber: string
    experience?: number
    gender: Gender.MALE | Gender.FEMALE
    appointmentFee: number
    qualifications: string
    currentWorkplace: string
    designation: string
  }
  specialties: string[]
}

export interface IUpdateDoctorSpecialtyChange {
  specialtyId: string
  shouldDelete?: boolean
}

export interface IUpdateDoctorPayload {
  id: string
  name?: string
  profilePhoto?: string
  contactNumber?: string
  address?: string
  registrationNumber?: string
  experience?: number
  gender?: Gender
  appointmentFee?: number
  qualifications?: string
  currentWorkplace?: string
  designation?: string
  specialties?: string[]
}

export interface IDoctorUserDetails {
  id?: string
  email?: string
  name?: string
  profilePhoto?: string
  role?: string
  status?: UserStatus
  emailVerified?: boolean
  image?: string
  isDeleted?: boolean
  deletedAt?: string | Date | null
  createdAt?: string | Date
  updatedAt?: string | Date
}

export interface IDoctorReview {
  id?: string
  rating?: number
  comment?: string
  patientId?: string
  createdAt?: string | Date
}

export interface IDoctorScheduleItem {
  id?: string
  isBooked?: boolean
  schedule?: {
    id?: string
    startDateTime?: string | Date
    endDateTime?: string | Date
  }
}

export interface IDoctorAppointmentItem {
  id?: string
  status?: string
  createdAt?: string | Date
  patient?: {
    id?: string
    name?: string
    email?: string
  }
  schedule?: {
    id?: string
    startDateTime?: string | Date
    endDateTime?: string | Date
  }
  prescription?: {
    id?: string
  } | null
}

export interface IDoctorDetails extends Omit<IDoctor, 'user'> {
  user: IDoctorUserDetails & { status: UserStatus }
  appointments?: IDoctorAppointmentItem[]
  doctorSchedules?: IDoctorScheduleItem[]
  reviews?: IDoctorReview[]
}
