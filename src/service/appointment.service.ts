'use server'

import { httpClient } from '@/app/lib/axios/httpClient'
import { ApiResponse } from '@/types/api.types'
import { AppointmentStatus, IAppointment } from '@/types/appointment.type'

export const getAppointments = async (queryString: string) => {
  try {
    const appointments = await httpClient.get<ApiResponse<IAppointment[]>>(
      queryString
        ? `/appointment/all-appointments?${queryString}`
        : '/appointment/all-appointments'
    )
    return appointments
  } catch (error) {
    console.log('Error fetching appointments:', error)
    throw error
  }
}

export const changeAppointmentStatus = async (
  appointmentId: string,
  status: AppointmentStatus
) => {
  try {
    const response = await httpClient.patch<IAppointment>(
      `/appointment/change-appointment-status/${appointmentId}`,
      { status }
    )
    return response
  } catch (error) {
    console.log('Error changing appointment status:', error)
    throw error
  }
}
