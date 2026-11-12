'use client'

import { GoogleIcon } from '@/components/icon/GoogleIcon'
import { getGoogleLoginUrl } from '@/components/modules/authModules/LoginForm'
import AppField from '@/components/shared/AppField'
import { AuthShell } from '@/components/shared/AuthShell'
import { Button } from '@/components/ui/button'
import { registerAction } from '@/service/auth.service'
import { IRegisterPayload, registerZodSchema } from '@/validation/auth.validation'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

const RegisterForm = () => {
  const router = useRouter()

  const [serverError, setServerError] = useState<string | null>(null)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [isGoogleRedirecting, setIsGoogleRedirecting] = useState(false)

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: IRegisterPayload) => registerAction(payload)
  })

  const isLoading = isPending || isRedirecting
  const isSocialLoading = isLoading || isGoogleRedirecting

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: ''
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

        toast.success(
          'Account created! Please enter the verification code sent to your email.'
        )

        setIsRedirecting(true)
        router.replace(result.redirectTo)
        router.refresh()
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : 'Registration failed. Please try again.'

        setServerError(message)
        toast.error(message)
      }
    }
  })

  const handleGoogleSignup = () => {
    try {
      setIsGoogleRedirecting(true)
      const url = getGoogleLoginUrl('/dashboard')
      window.location.assign(url)
    } catch (error: unknown) {
      setIsGoogleRedirecting(false)
      const message =
        error instanceof Error ? error.message : 'Unable to start Google signup.'
      toast.error(message)
    }
  }

  return (
    <AuthShell>
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className='space-y-5.5'>
        {serverError && (
          <div
            role='alert'
            className='flex items-center gap-2.5 rounded-sm border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive'>
            <AlertCircle className='size-4 shrink-0' />
            <p className='leading-tight'>{serverError}</p>
          </div>
        )}

        <form.Field
          name='name'
          validators={{
            onChange: registerZodSchema.shape.name
          }}>
          {(field) => (
            <AppField
              field={field}
              label='Full Name'
              type='text'
              placeholder='Enter your full name'
              autoComplete='name'
              disabled={isSocialLoading}
            />
          )}
        </form.Field>

        <form.Field
          name='email'
          validators={{
            onChange: registerZodSchema.shape.email
          }}>
          {(field) => (
            <AppField
              field={field}
              label='Email'
              type='email'
              placeholder='Enter your email'
              autoComplete='email'
              disabled={isSocialLoading}
            />
          )}
        </form.Field>

        <form.Field
          name='password'
          validators={{
            onChange: registerZodSchema.shape.password
          }}>
          {(field) => (
            <AppField
              field={field}
              label='Password'
              type='password'
              placeholder='Enter your password (min. 8 characters)'
              autoComplete='new-password'
              disabled={isSocialLoading}
            />
          )}
        </form.Field>

        <Button
          type='submit'
          disabled={isSocialLoading}
          className='h-[42px] w-full rounded-sm font-bold'>
          {isLoading ? (
            <span className='flex items-center justify-center gap-2'>
              <Loader2 className='size-4 animate-spin' />
              Creating Account...
            </span>
          ) : (
            'Create Account'
          )}
        </Button>

        <Button
          type='button'
          variant='outline'
          disabled={isSocialLoading}
          onClick={handleGoogleSignup}
          className='h-[42px] w-full rounded-sm border-primary/25 bg-card font-bold text-foreground shadow-[0_4px_5px_rgba(49,103,217,0.08)] hover:border-primary/50 hover:bg-secondary/40'>
          {isGoogleRedirecting ? (
            <Loader2 className='size-4 animate-spin' />
          ) : (
            <GoogleIcon className='size-4' />
          )}
          Continue with Google
        </Button>

        <Link
          href='/login'
          className='block text-center text-[13.5px] underline underline-offset-4 hover:text-primary'>
          Already have an account? Login
        </Link>
      </form>
    </AuthShell>
  )
}

export default RegisterForm
