'use server'

import { httpClient } from '@/app/lib/axios/httpClient'
import { ApiResponse } from '@/types/api.types'
import { ICreateSchedulePayload, ISchedule } from '@/types/schedule.types'

export const getSchedules = async (queryString: string) => {
  try {
    const endpoint = queryString ? `/schedule?${queryString}` : '/schedule'
    return await httpClient.get<ApiResponse<ISchedule[]>>(endpoint)
  } catch (error) {
    console.log('Error fetching schedules:', error)
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
