'use server'

import { httpClient } from '@/app/lib/axios/httpClient'
import {
  AppointmentStatus,
  IAppointment,
  IAppointmentBookingNow
} from '@/types/appointment.type'

export const getAppointments = async (queryString: string) => {
  try {
    const appointments = await httpClient.get<IAppointment[]>(
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

export const getMyAppointments = async (queryString?: string) => {
  try {
    const endpoint = queryString
      ? `/appointment/my-appointments?${queryString}`
      : '/appointment/my-appointments'
    const appointments =
      await httpClient.get<IAppointment[]>(endpoint)
    return appointments
  } catch (error) {
    console.log('Error fetching my appointments:', error)
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

export const bookAppointmentNow = async (
  doctorId: string,
  scheduleId: string
) => {
  try {
    const response = await httpClient.post<IAppointmentBookingNow>(
      '/appointment/book-appointment',
      {
        doctorId,
        scheduleId
      }
    )
    return response
  } catch (error) {
    console.log('Error creating appointment:', error)
    throw error
  }
}

export const bookNowPayLater = async (doctorId: string, scheduleId: string) => {
  try {
    const response = await httpClient.post<IAppointmentBookingNow>(
      '/appointment/book-appointment-with-pay-later',
      {
        doctorId,
        scheduleId
      }
    )
    return response
  } catch (error) {
    console.log('Error creating appointment:', error)
    throw error
  }
}

export const initiateAppointmentPayment = async (
  appointmentId: string,
  doctorId: string,
  scheduleId: string
) => {
  try {
    const response = await httpClient.post<IAppointmentBookingNow>(
      `/appointment/initiate-payment/${appointmentId}`,
      {
        doctorId,
        scheduleId
      }
    )
    return response
  } catch (error) {
    console.log('Error creating appointment:', error)
    throw error
  }
}
