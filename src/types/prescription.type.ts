import { IAppointment } from '@/types/appointment.type'
import { IDoctor } from '@/types/doctor.types'
import { IPatient } from '@/types/patient.types'

export interface IPrescription {
  id: string
  followUpDate: string
  instructions: string
  pdfUrl?: string | null
  createdAt: string
  updatedAt: string
  appointmentId: string
  patientId: string
  doctorId: string
  patient?: IPatient
  doctor?: IDoctor
  appointment?: IAppointment
}
