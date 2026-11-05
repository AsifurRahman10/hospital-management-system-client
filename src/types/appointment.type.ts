import { IDoctor } from '@/types/doctor.types'
import { IPatient } from '@/types/patient.types'
import { ISchedule } from '@/types/schedule.types'

export const AppointmentStatus = {
  SCHEDULED: 'SCHEDULED',
  INPROGRESS: 'INPROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELED: 'CANCELED'
} as const

export type AppointmentStatus =
  (typeof AppointmentStatus)[keyof typeof AppointmentStatus]

export interface IAppointment {
  id: string
  patientId: string
  doctorId: string
  doctorScheduleId?: string
  videoCallingId?: string
  status: AppointmentStatus | string
  paymentStatus: string
  createdAt: string
  updatedAt?: string
  scheduleId?: string
  doctor?: IDoctor
  patient?: IPatient
  schedule?: ISchedule
  doctorSchedule?: {
    id?: string
    schedule?: ISchedule
  }
}
