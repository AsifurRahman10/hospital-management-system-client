export interface IScheduleDoctorAssignment {
  doctorId: string
  scheduleId: string
  isBooked?: boolean
  createdAt?: string | Date
  updatedAt?: string | Date
}

export interface IScheduleAppointment {
  id?: string
  status?: string
  createdAt?: string | Date
  doctor?: {
    id?: string | number
    name?: string
    email?: string
  } | null
  patient?: {
    id?: string | number
    name?: string
    email?: string
  } | null
}

export interface ISchedule {
  id: string
  startDateTime: string
  endDateTime: string
  createdAt: string
  updatedAt: string
  doctorSchedules?: IScheduleDoctorAssignment[]
  appointments?: IScheduleAppointment[]
}

export interface ICreateSchedulePayload {
  startDate: string
  endDate: string
  startTime: string
  endTime: string
}

export interface IDoctorSchedule {
  id?: string
  doctorId: string
  scheduleId: string
  isBooked: boolean
  createdAt: string | Date
  updatedAt: string | Date
  doctor?: {
    id: string | number
    name: string
    email: string
    profilePhoto?: string
    contactNumber?: string
    designation?: string
    [key: string]: unknown
  } | null
  schedule?: {
    id: string
    startDateTime: string
    endDateTime: string
    createdAt?: string | Date
    updatedAt?: string | Date
    [key: string]: unknown
  } | null
}
