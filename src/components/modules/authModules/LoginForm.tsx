'use client'

import { GoogleIcon } from '@/components/icon/GoogleIcon'
import AppField from '@/components/shared/AppField'
import { AuthShell } from '@/components/shared/AuthShell'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { loginAction } from '@/service/auth.service'
import { ILoginPayload, loginZodSchema } from '@/validation/auth.validation'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

interface LoginFormProps {
  redirectPath?: string
}

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const getGoogleLoginUrl = (redirectPath = '/dashboard'): string => {
  if (!API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is not configured')
  }

  if (!redirectPath.startsWith('/') || redirectPath.startsWith('//')) {
    redirectPath = '/dashboard'
  }

  const url = new URL('/api/v1/auth/login/google', API_URL)

  url.searchParams.set('redirect', redirectPath)

  return url.toString()
}

const LoginForm = ({ redirectPath }: LoginFormProps) => {
  const router = useRouter()

  const [serverError, setServerError] = useState<string | null>(null)
  const [isGoogleRedirecting, setIsGoogleRedirecting] = useState(false)

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: ILoginPayload) => loginAction(payload, redirectPath)
  })

  const isLoading = isPending

  const form = useForm({
    defaultValues: {
      email: '',
      password: ''
    },

    onSubmit: async ({ value }) => {
      setServerError(null)

      try {
        const result = await mutateAsync(value)

        // Email verification required
        if (result.requiresVerification && result.redirectTo) {
          toast.warning(
            result.message || 'Please verify your email address to continue.'
          )

          form.reset()
          router.replace(result.redirectTo)
          return
        }

        if (!result.success) {
          setServerError(result.message)
          toast.error(result.message)
          return
        }

        toast.success('Logged in successfully!')

        form.reset()
        window.location.assign(result.redirectTo)
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : 'Login failed. Please try again.'

        setServerError(message)
        toast.error(message)
      }
    }
  })

  const handleGoogleLogin = () => {
    try {
      setIsGoogleRedirecting(true)

      const url = getGoogleLoginUrl(redirectPath || '/dashboard')

      window.location.assign(url)
    } catch (error: unknown) {
      setIsGoogleRedirecting(false)

      const message =
        error instanceof Error ? error.message : 'Unable to start Google login.'

      toast.error(message)
    }
  }

  const isSocialLoading = isLoading || isGoogleRedirecting

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
          name='email'
          validators={{
            onChange: loginZodSchema.shape.email
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
            onChange: loginZodSchema.shape.password
          }}>
          {(field) => (
            <AppField
              field={field}
              label='Password'
              type='password'
              placeholder='Enter your password'
              autoComplete='current-password'
              disabled={isSocialLoading}
            />
          )}
        </form.Field>

        <div className='flex items-center justify-between text-[13px]'>
          <label className='flex cursor-pointer items-center gap-2.5'>
            <Checkbox disabled={isSocialLoading} />
            Remember me
          </label>

          <Link
            href='/forgot-password'
            className='hover:text-primary'>
            Forgot Password?
          </Link>
        </div>

        <Button
          type='submit'
          disabled={isSocialLoading}
          className='h-[42px] w-full rounded-sm font-bold'>
          {isLoading ? (
            <span className='flex items-center justify-center gap-2'>
              <Loader2 className='size-4 animate-spin' />
              Logging in...
            </span>
          ) : (
            'Login'
          )}
        </Button>

        <Button
          type='button'
          variant='outline'
          disabled={isSocialLoading}
          onClick={handleGoogleLogin}
          className='h-[42px] w-full rounded-sm border-primary/25 bg-card font-bold text-foreground shadow-[0_4px_5px_rgba(49,103,217,0.08)] hover:border-primary/50 hover:bg-secondary/40'>
          {isGoogleRedirecting ? (
            <Loader2 className='size-4 animate-spin' />
          ) : (
            <GoogleIcon className='size-4' />
          )}
          Continue with Google
        </Button>

        <Link
          href='/register'
          className='block text-center text-[13.5px] underline underline-offset-4 hover:text-primary'>
          Create Account
        </Link>
      </form>
    </AuthShell>
  )
}

export default LoginForm
