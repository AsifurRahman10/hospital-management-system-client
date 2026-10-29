'use server'

/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpClient } from '@/app/lib/axios/httpClient'
import { ApiErrorResponse } from '@/types/api.types'
import { ILoginResponse } from '@/types/auth.types'
import { ILoginPayload, loginZodSchema } from '@/validation/auth.validation'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined')
}

export async function verifyUserWithToken() {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.toString()

  if (!cookieHeader) {
    return null
  }

  const res = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
    headers: {
      cookie: cookieHeader
    },
    cache: 'no-store'
  })

  if (!res.ok) {
    throw new Error(`Failed to verify user: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

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
    console.log(response.data)

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
