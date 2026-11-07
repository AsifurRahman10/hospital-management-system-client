'use server'

import { httpClient } from '@/app/lib/axios/httpClient'
import { ApiResponse } from '@/types/api.types'
import { IProfile } from '@/types/profile.types'

export const getMe = async (): Promise<ApiResponse<IProfile>> => {
  try {
    const response = await httpClient.get<IProfile>('/auth/me')
    return response
  } catch (error) {
    console.error('Error fetching user profile:', error)
    throw error
  }
}

export const updateMyProfile = async (
  role: string,
  formData: FormData
): Promise<ApiResponse<unknown>> => {
  try {
    const normalizedRole = role.toUpperCase()
    let endpoint = '/patient/update-my-profile'

    if (normalizedRole === 'ADMIN' || normalizedRole === 'SUPER_ADMIN') {
      endpoint = '/admin/update-my-profile'
    } else if (normalizedRole === 'DOCTOR') {
      endpoint = '/doctor/update-my-profile'
    } else if (normalizedRole === 'PATIENT') {
      endpoint = '/patient/update-my-profile'
    }

    const response = await httpClient.patch<unknown>(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response
  } catch (error) {
    console.error('Error updating profile:', error)
    throw error
  }
}

export const changePassword = async (payload: {
  oldPassword: string
  newPassword: string
}): Promise<ApiResponse<unknown>> => {
  try {
    const response = await httpClient.post<unknown>(
      '/auth/change-password',
      payload
    )
    return response
  } catch (error) {
    console.error('Error changing password:', error)
    throw error
  }
}
