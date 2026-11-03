'use server'

import { httpClient } from '@/app/lib/axios/httpClient'
import { ApiResponse } from '@/types/api.types'
import {
  ICreateDoctorPayload,
  IDoctor,
  IDoctorDetails,
  IUpdateDoctorPayload
} from '@/types/doctor.types'
import { ISpecialty } from '@/types/specialty.types'

export const getDoctors = async (queryString: string) => {
  try {
    const doctors = await httpClient.get<ApiResponse<IDoctor[]>>(
      queryString ? `/doctor?${queryString}` : '/doctor'
    )
    return doctors
  } catch (error) {
    console.log('Error fetching doctors:', error)
    throw error
  }
}

export const getAllSpecialties = async () => {
  try {
    const specialties = await httpClient.get<ISpecialty[]>('/specialty')
    return specialties
  } catch (error) {
    console.log('Error fetching specialties:', error)
    throw error
  }
}

export const createDoctor = async (payload: ICreateDoctorPayload) => {
  try {
    const response = await httpClient.post<IDoctor>(
      '/user/register-doctor',
      payload
    )
    return response
  } catch (error) {
    console.log('Error creating doctor:', error)
    throw error
  }
}

export const updateDoctor = async (
  id: string,
  payload: IUpdateDoctorPayload
) => {
  try {
    console.log(payload)
    const response = await httpClient.patch<IDoctor>(`/doctor/${id}`, payload)
    // console.log(response)
    return response
  } catch (error) {
    console.log('Error updating doctor:', error)
    throw error
  }
}

export const deleteDoctor = async (id: string) => {
  try {
    const response = await httpClient.delete<{ message: string }>(
      `/doctor/${id}`
    )
    return response
  } catch (error) {
    console.log('Error deleting doctor:', error)
    throw error
  }
}

export const getDoctorById = async (id: string) => {
  try {
    const doctor = await httpClient.get<IDoctorDetails>(`/doctor/${id}`)
    return doctor
  } catch (error) {
    console.log('Error fetching doctor by id:', error)
    throw error
  }
}
