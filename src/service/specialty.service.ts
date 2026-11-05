'use server'

import { httpClient } from '@/app/lib/axios/httpClient'
import { ISpecialty, IUpdateSpecialtyPayload } from '@/types/specialty.types'

export const getSpecialties = async (queryString?: string) => {
  try {
    const endpoint = queryString ? `/specialty?${queryString}` : '/specialty'
    return await httpClient.get<ISpecialty[]>(endpoint)
  } catch (error) {
    console.log('Error fetching specialties:', error)
    throw error
  }
}

export const getSingleSpecialty = async (id: string) => {
  try {
    return await httpClient.get<ISpecialty>(`/specialty/${id}`)
  } catch (error) {
    console.log('Error fetching single specialty:', error)
    throw error
  }
}

export const createSpecialty = async (formData: FormData) => {
  try {
    return await httpClient.post<ISpecialty>('/specialty', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  } catch (error) {
    console.log('Error creating specialty:', error)
    throw error
  }
}

export const updateSpecialty = async (
  id: string,
  payload: IUpdateSpecialtyPayload
) => {
  try {
    return await httpClient.patch<ISpecialty>(`/specialty/${id}`, payload)
  } catch (error) {
    console.log('Error updating specialty:', error)
    throw error
  }
}

export const deleteSpecialty = async (id: string) => {
  try {
    return await httpClient.delete<null>(`/specialty/${id}`)
  } catch (error) {
    console.log('Error deleting specialty:', error)
    throw error
  }
}
