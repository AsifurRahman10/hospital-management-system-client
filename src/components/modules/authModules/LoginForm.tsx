/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import AppField from '@/components/shared/AppField'
import { AuthShell } from '@/components/shared/AuthShell'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { loginAction } from '@/service/auth.service'
import { ILoginPayload, loginZodSchema } from '@/validation/auth.validation'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import { useState } from 'react'

interface LoginFormProps {
  redirectPath?: string
}

const LoginForm = ({ redirectPath }: LoginFormProps) => {
  const [serverError, setServerError] = useState<string | null>(null)
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: ILoginPayload) => loginAction(payload, redirectPath)
  })
  const form = useForm({
    defaultValues: {
      email: '',
      password: ''
    },

    onSubmit: async ({ value }) => {
      setServerError(null)
      try {
        const result = (await mutateAsync(value)) as any
        if (!result.success) {
          setServerError(result.message || 'Login failed')
          return
        }
      } catch (error: any) {
        console.log(`Login failed: ${error.message}`)
        setServerError(`Login failed: ${error.message}`)
      }
    }
  })
  return (
    <AuthShell>
      <form
        method='POST'
        action='#'
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className='space-y-5.5'>
        <form.Field
          name='email'
          validators={{ onChange: loginZodSchema.shape.email }}>
          {(field) => (
            <AppField
              field={field}
              label='Email'
              type='email'
              placeholder='Enter your email'
            />
          )}
        </form.Field>
        <form.Field
          name='password'
          validators={{ onChange: loginZodSchema.shape.password }}>
          {(field) => (
            <AppField
              field={field}
              label='Password'
              type='password'
              placeholder='Enter your password'
            />
          )}
        </form.Field>
        <div className='flex items-center justify-between text-[13px]'>
          <label className='flex cursor-pointer items-center gap-2.5'>
            <Checkbox name='remember' /> Remember me
          </label>
          <Link
            href='/forgot-password'
            className='hover:text-primary'>
            Forgot Password?
          </Link>
        </div>

        <Button
          type='submit'
          className='h-[42px] w-full rounded-sm font-bold'>
          Login
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
