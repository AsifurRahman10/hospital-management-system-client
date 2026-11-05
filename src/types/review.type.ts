import { IAppointment } from '@/types/appointment.type'
import { IDoctor } from '@/types/doctor.types'
import { IPatient } from '@/types/patient.types'

export interface IReview {
  id: string
  patientId: string
  doctorId: string
  appointmentId: string
  rating: number
  comment?: string | null
  createdAt: string
  updatedAt: string
  patient?: IPatient
  doctor?: IDoctor
  appointment?: IAppointment
}
