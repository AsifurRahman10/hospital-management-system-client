'use server'

import { httpClient } from '@/app/lib/axios/httpClient'
import { ApiResponse } from '@/types/api.types'
import { IDoctorSchedule } from '@/types/schedule.types'

export const getDoctorWiseSchedules = async (queryString: string) => {
  try {
    const schedules = await httpClient.get<ApiResponse<IDoctorSchedule[]>>(
      queryString
        ? `/doctorSchedule/doctor-wise-schedules?${queryString}`
        : '/doctorSchedule/doctor-wise-schedules'
    )
    return schedules
  } catch (error) {
    console.log('Error fetching doctor schedules:', error)
    throw error
  }
}

export const getDoctorSchedules = getDoctorWiseSchedules

export const createDoctorWiseSchedule = async (payload: {
  scheduleIds: string[]
}) => {
  try {
    const response = await httpClient.post<ApiResponse<unknown>>(
      '/doctorSchedule/create-doctor-wise-schedule',
      payload
    )
    return response
  } catch (error) {
    console.log('Error creating doctor schedule:', error)
    throw error
  }
}

export const deleteOwnDoctorSchedule = async (id: string) => {
  try {
    const response = await httpClient.delete<ApiResponse<null>>(
      `/doctorSchedule/delete-own-doctor-schedule/${id}`
    )
    return response
  } catch (error) {
    console.log('Error deleting doctor schedule:', error)
    throw error
  }
}
