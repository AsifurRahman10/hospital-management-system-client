'use client'

import AppField from '@/components/shared/AppField'
import { AuthShell } from '@/components/shared/AuthShell'
import { Button } from '@/components/ui/button'
import {
  resendVerificationEmailAction,
  verifyEmailAction
} from '@/service/auth.service'
import {
  IVerifyEmailPayload,
  verifyEmailZodSchema
} from '@/validation/auth.validation'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { AlertCircle, CheckCircle2, Loader2, MailCheck } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface VerifyEmailFormProps {
  initialEmail?: string
  isUnverifiedWarning?: boolean
}

const VerifyEmailForm = ({
  initialEmail = '',
  isUnverifiedWarning = false
}: VerifyEmailFormProps) => {
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
    mutationFn: (payload: IVerifyEmailPayload) => verifyEmailAction(payload)
  })

  const isLoading = isPending || isRedirecting

  const form = useForm({
    defaultValues: {
      email: initialEmail,
      otp: ''
    },

    onSubmit: async ({ value }) => {
      setServerError(null)

      try {
        const result = await mutateAsync(value)

        if (!result.success) {
          setServerError(result.message)
          toast.error(result.message)
          return
        }

        toast.success('Email verified successfully! You can now log in.')

        setIsRedirecting(true)
        router.replace(result.redirectTo)
        router.refresh()
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : 'Email verification failed. Please try again.'

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
      const result = await resendVerificationEmailAction(emailValue)
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
          : 'Failed to resend verification code'
      )
    } finally {
      setIsResending(false)
    }
  }

  return (
    <AuthShell>
      <div className='mb-2 text-center'>
        <div className='mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary'>
          <MailCheck className='size-6' />
        </div>
        <h1 className='text-xl font-bold text-foreground'>Verify Your Email</h1>
        <p className='mt-1 text-xs text-muted-foreground'>
          Enter the verification code sent to your inbox to activate your
          account.
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
        {isUnverifiedWarning && (
          <div
            role='alert'
            className='flex items-start gap-2.5 rounded-sm border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-400'>
            <AlertCircle className='size-4 shrink-0 mt-0.5' />
            <p className='leading-tight'>
              Your email is not verified. Please verify your email with the OTP
              to use our private services.
            </p>
          </div>
        )}

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
            onChange: verifyEmailZodSchema.shape.email
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
            onChange: verifyEmailZodSchema.shape.otp
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

        <div className='flex items-center justify-between text-xs text-muted-foreground pt-0.5'>
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
              Verifying...
            </span>
          ) : (
            <span className='flex items-center justify-center gap-1.5'>
              <CheckCircle2 className='size-4' />
              Verify Email
            </span>
          )}
        </Button>

        <div className='flex items-center justify-between text-[13px] pt-1'>
          <Link
            href='/login'
            className='hover:text-primary underline underline-offset-4'>
            Back to Login
          </Link>
          <Link
            href='/register'
            className='hover:text-primary underline underline-offset-4'>
            Create Account
          </Link>
        </div>
      </form>
    </AuthShell>
  )
}

export default VerifyEmailForm
