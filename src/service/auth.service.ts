'use server'

/* eslint-disable @typescript-eslint/no-explicit-any */

import { httpClient } from '@/app/lib/axios/httpClient'
import { ApiErrorResponse, ApiResponse } from '@/types/api.types'
import { ILoginResponse, ILogoutResponse } from '@/types/auth.types'
import {
  ILoginPayload,
  IRegisterPayload,
  IVerifyEmailPayload,
  loginZodSchema,
  registerZodSchema,
  verifyEmailZodSchema
} from '@/validation/auth.validation'
import { redirect } from 'next/navigation'

export type LoginActionResult =
  | { success: true; redirectTo: string; requiresVerification?: false }
  | {
      success: false
      message: string
      requiresVerification?: boolean
      redirectTo?: string
    }

export type RegisterActionResult =
  | { success: true; redirectTo: string }
  | { success: false; message: string }

export type VerifyEmailActionResult =
  | { success: true; redirectTo: string }
  | { success: false; message: string }

export type ResendVerificationActionResult =
  | { success: true; message: string }
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
      const respError = (response as any)?.error || response.message || ''
      if (
        typeof respError === 'string' &&
        respError.toLowerCase().includes('email not verified')
      ) {
        return {
          success: false,
          requiresVerification: true,
          message:
            'Your email is not verified. A verification code has been sent to your email.',
          redirectTo: `/verify-email?email=${encodeURIComponent(parsedPayload.data.email)}&unverified=true`
        }
      }

      return {
        success: false,
        message: response.message || 'Login failed'
      }
    }

    const user = response.data?.user
    if (user && user.emailVerified === false) {
      return {
        success: false,
        requiresVerification: true,
        message:
          'Your email is not verified. Please verify your email with the OTP.',
        redirectTo: `/verify-email?email=${encodeURIComponent(user.email)}&unverified=true`
      }
    }

    return {
      success: true,
      redirectTo: getSafeRedirectPath(redirectPath)
    }
  } catch (error: any) {
    console.error('Login failed:', error)

    const responseData = error?.response?.data
    const errorMessage =
      responseData?.error ||
      responseData?.message ||
      (typeof responseData === 'string' ? responseData : '') ||
      error?.message ||
      ''

    if (
      typeof errorMessage === 'string' &&
      errorMessage.toLowerCase().includes('email not verified')
    ) {
      return {
        success: false,
        requiresVerification: true,
        message:
          'Your email is not verified. A verification code has been sent to your email.',
        redirectTo: `/verify-email?email=${encodeURIComponent(parsedPayload.data.email)}&unverified=true`
      }
    }

    return {
      success: false,
      message:
        responseData?.message ||
        error.message ||
        'Login failed. Please try again.'
    }
  }
}

export const registerAction = async (
  payload: IRegisterPayload
): Promise<RegisterActionResult> => {
  const parsedPayload = registerZodSchema.safeParse(payload)

  if (!parsedPayload.success) {
    return {
      success: false,
      message: parsedPayload.error.issues[0]?.message || 'Invalid input'
    }
  }

  try {
    const response = await httpClient.post('/auth/register', parsedPayload.data)

    if (!response.success) {
      return {
        success: false,
        message: response.message || 'Registration failed'
      }
    }

    return {
      success: true,
      redirectTo: `/verify-email?email=${encodeURIComponent(parsedPayload.data.email)}`
    }
  } catch (error: any) {
    console.error('Registration failed:', error)

    return {
      success: false,
      message: error.message || 'Registration failed. Please try again.'
    }
  }
}

export const verifyEmailAction = async (
  payload: IVerifyEmailPayload
): Promise<VerifyEmailActionResult> => {
  const parsedPayload = verifyEmailZodSchema.safeParse(payload)

  if (!parsedPayload.success) {
    return {
      success: false,
      message: parsedPayload.error.issues[0]?.message || 'Invalid input'
    }
  }

  try {
    const response = await httpClient.post(
      '/auth/verify-email',
      parsedPayload.data
    )

    if (!response.success) {
      return {
        success: false,
        message: response.message || 'Email verification failed'
      }
    }

    return {
      success: true,
      redirectTo: '/login'
    }
  } catch (error: any) {
    console.error('Email verification failed:', error)

    return {
      success: false,
      message: error.message || 'Email verification failed. Please try again.'
    }
  }
}

export const resendVerificationEmailAction = async (
  email: string
): Promise<ResendVerificationActionResult> => {
  if (!email || !email.includes('@')) {
    return {
      success: false,
      message: 'Please provide a valid email address.'
    }
  }

  try {
    const response = await httpClient.post<any>(
      '/auth/resend-verification-email',
      { email }
    )

    if (!response.success) {
      return {
        success: false,
        message: response.message || 'Failed to resend verification email'
      }
    }

    return {
      success: true,
      message:
        response.message ||
        'Verification email resent successfully! Please check your inbox.'
    }
  } catch (error: any) {
    console.error('Resend verification email failed:', error)

    const responseData = error?.response?.data
    return {
      success: false,
      message:
        responseData?.message ||
        responseData?.error ||
        error.message ||
        'Failed to resend verification email. Please try again.'
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
