'use server'

import { httpClient } from '@/app/lib/axios/httpClient'
import { ApiResponse } from '@/types/api.types'
import { IPatient } from '@/types/patient.types'
import { UserStatus } from '@/types/user.types'

export const getPatients = async (queryString: string) => {
  return httpClient.get<ApiResponse<IPatient[]>>(
    queryString ? `/patient?${queryString}` : '/patient'
  )
}

export const updatePatientStatus = async (id: string, status: UserStatus) => {
  return httpClient.patch<IPatient>(`/patient/${id}/status`, { status })
}

export const deletePatient = async (id: string) => {
  return httpClient.delete<{ message: string }>(`/patient/${id}`)
}
