'use server'

import { httpClient } from '@/app/lib/axios/httpClient'
import { ApiResponse } from '@/types/api.types'
import { IDoctorSchedule } from '@/types/schedule.types'

export const getDoctorWiseSchedules = async (queryString: string) => {
  try {
    const schedules = await httpClient.get<ApiResponse<IDoctorSchedule[]>>(
      queryString ? `/doctorSchedule?${queryString}` : '/doctorSchedule'
    )
    return schedules
  } catch (error) {
    console.log('Error fetching doctor schedules:', error)
    throw error
  }
}

export const getDoctorSchedules = getDoctorWiseSchedules
