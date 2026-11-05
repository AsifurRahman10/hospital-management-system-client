'use server'

import { httpClient } from '@/app/lib/axios/httpClient'
import { ApiResponse } from '@/types/api.types'
import { ICreateSchedulePayload, ISchedule } from '@/types/schedule.types'

export const getSchedules = async (queryString: string) => {
  try {
    const doctors = await httpClient.get<ApiResponse<ISchedule[]>>(
      queryString ? `/schedule?${queryString}` : '/schedule'
    )
    return doctors
  } catch (error) {
    console.log('Error fetching doctors:', error)
    throw error
  }
}

export const createSchedule = async (payload: ICreateSchedulePayload) => {
  try {
    return await httpClient.post<ISchedule>('/schedule', payload)
  } catch (error) {
    console.log('Error creating schedule:', error)
    throw error
  }
}

export const deleteSchedule = async (id: string) => {
  try {
    return await httpClient.delete<null>(`/schedule/${id}`)
  } catch (error) {
    console.log('Error deleting schedule:', error)
    throw error
  }
}
