'use client'

import AppField from '@/components/shared/AppField'
import { AuthShell } from '@/components/shared/AuthShell'
import { Button } from '@/components/ui/button'
import { forgotPasswordAction } from '@/service/auth.service'
import {
  IForgotPasswordPayload,
  forgotPasswordZodSchema
} from '@/validation/auth.validation'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { AlertCircle, KeyRound, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

const ForgotPasswordForm = () => {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isRedirecting, setIsRedirecting] = useState(false)

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: IForgotPasswordPayload) =>
      forgotPasswordAction(payload)
  })

  const isLoading = isPending || isRedirecting

  const form = useForm({
    defaultValues: {
      email: ''
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

        toast.success(result.message)
        setIsRedirecting(true)
        router.push(result.redirectTo)
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : 'Failed to send password reset code. Please try again.'

        setServerError(message)
        toast.error(message)
      }
    }
  })

  return (
    <AuthShell>
      <div className='mb-3 text-center'>
        <div className='mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary'>
          <KeyRound className='size-6' />
        </div>
        <h2 className='text-xl font-bold text-foreground'>Forgot Password</h2>
        <p className='mt-1 text-xs text-muted-foreground'>
          Enter your verified email address to receive a password reset OTP.
        </p>
      </div>

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className='space-y-5 pt-2'>
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
            onChange: forgotPasswordZodSchema.shape.email
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

        <Button
          type='submit'
          disabled={isLoading}
          className='h-[42px] w-full rounded-sm font-bold'>
          {isLoading ? (
            <span className='flex items-center justify-center gap-2'>
              <Loader2 className='size-4 animate-spin' />
              Sending code...
            </span>
          ) : (
            'Send Reset Code'
          )}
        </Button>

        <div className='flex items-center justify-between pt-1 text-[13px]'>
          <Link
            href='/login'
            className='underline underline-offset-4 hover:text-primary'>
            Back to Login
          </Link>
          <Link
            href='/reset-password'
            className='underline underline-offset-4 hover:text-primary'>
            Have a code?
          </Link>
        </div>
      </form>
    </AuthShell>
  )
}

export default ForgotPasswordForm
