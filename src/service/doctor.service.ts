'use server'

import { httpClient } from '@/app/lib/axios/httpClient'
import { ApiResponse } from '@/types/api.types'
import { IDoctor } from '@/types/doctor.types'

export const getDoctors = async () => {
  try {
    const doctors = await httpClient.get<ApiResponse<IDoctor[]>>('/doctor')
    return doctors
  } catch (error) {
    console.log('Error fetching doctors:', error)
    throw error
  }
}
