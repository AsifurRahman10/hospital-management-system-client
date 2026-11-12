'use client'

import AppField from '@/components/shared/AppField'
import { AuthShell } from '@/components/shared/AuthShell'
import { Button } from '@/components/ui/button'
import {
  forgotPasswordAction,
  resetPasswordAction
} from '@/service/auth.service'
import {
  IResetPasswordPayload,
  resetPasswordZodSchema
} from '@/validation/auth.validation'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { AlertCircle, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface ResetPasswordFormProps {
  initialEmail?: string
}

const ResetPasswordForm = ({ initialEmail = '' }: ResetPasswordFormProps) => {
  const router = useRouter()

  const [serverError, setServerError] = useState<string | null>(null)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [resendCooldown])

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: IResetPasswordPayload) => resetPasswordAction(payload)
  })

  const isLoading = isPending || isRedirecting

  const form = useForm({
    defaultValues: {
      email: initialEmail,
      otp: '',
      newPassword: '',
      confirmPassword: ''
    },
    onSubmit: async ({ value }) => {
      setServerError(null)

      if (value.newPassword !== value.confirmPassword) {
        const message = 'Passwords do not match.'
        setServerError(message)
        toast.error(message)
        return
      }

      try {
        const result = await mutateAsync({
          email: value.email,
          otp: value.otp,
          newPassword: value.newPassword
        })

        if (!result.success) {
          setServerError(result.message)
          toast.error(result.message)
          return
        }

        toast.success(result.message)
        setIsRedirecting(true)
        router.replace(result.redirectTo)
        router.refresh()
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : 'Password reset failed. Please try again.'

        setServerError(message)
        toast.error(message)
      }
    }
  })

  const handleResend = async () => {
    const emailValue = form.getFieldValue('email')
    if (!emailValue || !emailValue.includes('@')) {
      toast.error('Please enter a valid email address first.')
      return
    }

    setIsResending(true)
    try {
      const result = await forgotPasswordAction({ email: emailValue })
      if (!result.success) {
        toast.error(result.message)
        return
      }

      toast.success(result.message)
      setResendCooldown(60)
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to resend reset code.'
      )
    } finally {
      setIsResending(false)
    }
  }

  return (
    <AuthShell>
      <div className='mb-2 text-center'>
        <div className='mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary'>
          <ShieldCheck className='size-6' />
        </div>
        <h2 className='text-xl font-bold text-foreground'>Reset Password</h2>
        <p className='mt-1 text-xs text-muted-foreground'>
          Enter the OTP sent to your email along with your new password.
        </p>
      </div>

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className='space-y-4 pt-2'>
        {serverError && (
          <div
            role='alert'
            className='flex items-center gap-2.5 rounded-sm border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive'>
            <AlertCircle className='size-4 shrink-0' />
            <p className='leading-tight'>{serverError}</p>
          </div>
        )}

        <form.Field
          name='email'
          validators={{
            onChange: resetPasswordZodSchema.shape.email
          }}>
          {(field) => (
            <AppField
              field={field}
              label='Email'
              type='email'
              placeholder='Enter your email'
              autoComplete='email'
              disabled={isLoading}
            />
          )}
        </form.Field>

        <form.Field
          name='otp'
          validators={{
            onChange: resetPasswordZodSchema.shape.otp
          }}>
          {(field) => (
            <AppField
              field={field}
              label='Verification Code (OTP)'
              type='text'
              placeholder='Enter 6-digit OTP'
              autoComplete='one-time-code'
              disabled={isLoading}
            />
          )}
        </form.Field>

        <form.Field
          name='newPassword'
          validators={{
            onChange: resetPasswordZodSchema.shape.newPassword
          }}>
          {(field) => (
            <AppField
              field={field}
              label='New Password'
              type='password'
              placeholder='Enter new password'
              autoComplete='new-password'
              disabled={isLoading}
            />
          )}
        </form.Field>

        <form.Field
          name='confirmPassword'
          validators={{
            onChangeListenTo: ['newPassword'],
            onChange: ({ value, fieldApi }) => {
              if (!value) return 'Please confirm your new password'
              if (value !== fieldApi.form.getFieldValue('newPassword')) {
                return 'Passwords do not match'
              }
              return undefined
            }
          }}>
          {(field) => (
            <AppField
              field={field}
              label='Confirm New Password'
              type='password'
              placeholder='Confirm new password'
              autoComplete='new-password'
              disabled={isLoading}
            />
          )}
        </form.Field>

        <div className='flex items-center justify-between pt-0.5 text-xs text-muted-foreground'>
          <span>Didn&apos;t receive the code?</span>
          <button
            type='button'
            disabled={isResending || resendCooldown > 0 || isLoading}
            onClick={handleResend}
            className='font-semibold text-primary hover:underline disabled:pointer-events-none disabled:opacity-50'>
            {isResending ? (
              <span className='inline-flex items-center gap-1'>
                <Loader2 className='size-3 animate-spin' /> Sending...
              </span>
            ) : resendCooldown > 0 ? (
              `Resend in ${resendCooldown}s`
            ) : (
              'Resend code'
            )}
          </button>
        </div>

        <Button
          type='submit'
          disabled={isLoading}
          className='h-[42px] w-full rounded-sm font-bold'>
          {isLoading ? (
            <span className='flex items-center justify-center gap-2'>
              <Loader2 className='size-4 animate-spin' />
              Resetting...
            </span>
          ) : (
            <span className='flex items-center justify-center gap-1.5'>
              <CheckCircle2 className='size-4' />
              Reset Password
            </span>
          )}
        </Button>

        <div className='flex items-center justify-between pt-1 text-[13px]'>
          <Link
            href='/login'
            className='underline underline-offset-4 hover:text-primary'>
            Back to Login
          </Link>
          <Link
            href='/forgot-password'
            className='underline underline-offset-4 hover:text-primary'>
            Request New Code
          </Link>
        </div>
      </form>
    </AuthShell>
  )
}

export default ResetPasswordForm
