'use server'

/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpClient } from '@/app/lib/axios/httpClient'
import { ApiErrorResponse } from '@/types/api.types'
import { ILoginResponse } from '@/types/auth.types'
import { ILoginPayload, loginZodSchema } from '@/validation/auth.validation'
import { redirect } from 'next/navigation'

export const loginAction = async (
  payload: ILoginPayload,
  redirectPath?: string
): Promise<ILoginResponse | ApiErrorResponse> => {
  const parsedPayload = loginZodSchema.safeParse(payload)

  if (!parsedPayload.success) {
    const firstError = parsedPayload.error.issues[0].message || 'Invalid input'
    return {
      success: false,
      message: firstError
    }
  }

  try {
    const response = await httpClient.post<ILoginResponse>(
      '/auth/login',
      parsedPayload.data
    )

    if (!response.success) {
      return {
        success: false,
        message: response.message || 'Login failed'
      }
    }

    if (redirectPath) {
      redirect(redirectPath)
    } else {
      redirect('/')
    }
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
      message: `Login failed: ${error.message}`
    }
  }
}
