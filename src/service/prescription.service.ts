'use server'

import { httpClient } from '@/app/lib/axios/httpClient'
import { ApiResponse } from '@/types/api.types'
import {
  ICreatePrescriptionPayload,
  IPrescription,
  IUpdatePrescriptionPayload
} from '@/types/prescription.type'

export const getPrescriptions = async (queryString?: string) => {
  try {
    const endpoint = queryString
      ? `/prescription?${queryString}`
      : '/prescription'
    return await httpClient.get<ApiResponse<IPrescription[]>>(endpoint)
  } catch (error) {
    console.log('Error fetching prescriptions:', error)
    throw error
  }
}

export const getMyPrescriptions = async () => {
  try {
    const response = await httpClient.get<ApiResponse<IPrescription[]>>(
      '/prescription/my-prescriptions'
    )
    return response
  } catch (error) {
    console.log('Error fetching my prescriptions:', error)
    throw error
  }
}

export const createPrescription = async (
  payload: ICreatePrescriptionPayload
) => {
  try {
    const response = await httpClient.post<ApiResponse<IPrescription>>(
      '/prescription',
      payload
    )
    return response
  } catch (error: any) {
    if (error?.response?.status === 404) {
      return await httpClient.post<ApiResponse<IPrescription>>(
        '/prescription/create-prescription',
        payload
      )
    }
    console.log('Error creating prescription:', error)
    throw error
  }
}

export const updatePrescription = async (
  id: string,
  payload: IUpdatePrescriptionPayload
) => {
  try {
    const response = await httpClient.patch<ApiResponse<IPrescription>>(
      `/prescription/${id}`,
      payload
    )
    return response
  } catch (error) {
    console.log('Error updating prescription:', error)
    throw error
  }
}

export const deletePrescription = async (id: string) => {
  try {
    const response = await httpClient.delete<ApiResponse<null>>(
      `/prescription/${id}`
    )
    return response
  } catch (error) {
    console.log('Error deleting prescription:', error)
    throw error
  }
}
