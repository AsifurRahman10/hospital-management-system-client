'use server'

/* eslint-disable @typescript-eslint/no-explicit-any */

import { httpClient } from '@/app/lib/axios/httpClient'
import { ApiErrorResponse, ApiResponse } from '@/types/api.types'
import { ILoginResponse, ILogoutResponse } from '@/types/auth.types'
import { ILoginPayload, loginZodSchema } from '@/validation/auth.validation'
import { redirect } from 'next/navigation'

export type LoginActionResult =
  | { success: true; redirectTo: string }
  | { success: false; message: string }

const getSafeRedirectPath = (path?: string): string => {
  if (path && path.startsWith('/') && !path.startsWith('//')) {
    return path
  }
  return '/'
}

export const loginAction = async (
  payload: ILoginPayload,
  redirectPath?: string
): Promise<LoginActionResult> => {
  const parsedPayload = loginZodSchema.safeParse(payload)

  if (!parsedPayload.success) {
    return {
      success: false,
      message: parsedPayload.error.issues[0]?.message || 'Invalid input'
    }
  }

  try {
    const response: ApiResponse<ILoginResponse> =
      await httpClient.post<ILoginResponse>('/auth/login', parsedPayload.data)

    if (!response.success) {
      return {
        success: false,
        message: response.message || 'Login failed'
      }
    }

    return {
      success: true,
      redirectTo: getSafeRedirectPath(redirectPath)
    }
  } catch (error: any) {
    console.error('Login failed:', error)

    return {
      success: false,
      message: error.message || 'Login failed. Please try again.'
    }
  }
}

export const logoutAction = async (): Promise<
  ILogoutResponse | ApiErrorResponse
> => {
  let response: ILogoutResponse

  try {
    response = await httpClient.post('/auth/logout')

    if (!response.success) {
      return {
        success: false,
        message: response.message || 'Logout failed'
      }
    }
  } catch (error: any) {
    console.error('Logout failed:', error)

    return {
      success: false,
      message: error.message || 'Logout failed'
    }
  }

  redirect('/')
}
