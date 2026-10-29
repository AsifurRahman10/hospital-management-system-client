/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpClient } from '@/app/lib/axios/httpClient'
import { ApiErrorResponse } from '@/types/api.types'
import { DoctorDashboardStats } from '@/types/dashboard.type'

export const getStats = async (): Promise<
  DoctorDashboardStats | ApiErrorResponse
> => {
  try {
    const response = await httpClient.get<DoctorDashboardStats>('/stats')
    return response.data
  } catch (error: any) {
    if (
      error &&
      typeof error === 'object' &&
      'digest' in error &&
      typeof error.digest === 'string' &&
      error.digest.startsWith('NEXT_REDIRECT')
    ) {
      throw error
    }
    return {
      success: false,
      message: `Failed to fetch dashboard stats: ${error.message}`
    }
  }
}
