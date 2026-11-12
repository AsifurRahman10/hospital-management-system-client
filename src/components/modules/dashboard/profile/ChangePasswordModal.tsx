'use client'

import AppField from '@/components/shared/AppField'
import AppModal from '@/components/shared/AppModal'
import { Button } from '@/components/ui/button'
import { loginAction } from '@/service/auth.service'
import { changePassword } from '@/service/profile.service'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { KeyRound, LoaderCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface ChangePasswordModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userEmail?: string
}

export const ChangePasswordModal = ({
  open,
  onOpenChange,
  userEmail
}: ChangePasswordModalProps) => {
  const router = useRouter()

  const { mutateAsync: mutateChangePassword, isPending: isChangingPassword } =
    useMutation({
      mutationFn: changePassword
    })

  const { mutateAsync: mutateLogin, isPending: isLoggingIn } = useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      loginAction(credentials, '/my-profile')
  })

  const isPending = isChangingPassword || isLoggingIn

  const form = useForm({
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    onSubmit: async ({ value }) => {
      if (!value.oldPassword) {
        toast.error('Current password is required.')
        return
      }

      if (!value.newPassword || value.newPassword.length < 8) {
        toast.error('New password must be at least 8 characters long.')
        return
      }

      if (value.newPassword !== value.confirmPassword) {
        toast.error('New password and confirm password do not match.')
        return
      }

      try {
        const res = (await mutateChangePassword({
          oldPassword: value.oldPassword,
          newPassword: value.newPassword
        })) as { success?: boolean; message?: string }

        if (res?.success === false) {
          toast.error(res.message || 'Failed to change password.')
          return
        }

        form.reset()
        onOpenChange(false)

        // Auto-login with user email and new password to keep session fresh
        if (userEmail) {
          toast.loading('Refreshing security session...')
          try {
            const loginRes = (await mutateLogin({
              email: userEmail,
              password: value.newPassword
            })) as { success?: boolean; message?: string }

            if (loginRes && loginRes.success === false) {
              toast.dismiss()
              toast.success(
                'Password changed successfully. Please log in with your new password.'
              )
              router.push('/login')
              return
            }

            toast.dismiss()
            toast.success('Password changed and session refreshed successfully!')
            router.refresh()
            return
          } catch {
            toast.dismiss()
            toast.success(
              'Password changed successfully. Please log in with your new password.'
            )
            router.push('/login')
            return
          }
        }

        toast.success(
          res?.message ||
            'Password changed successfully. Please log in with your new password.'
        )
        router.push('/login')
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Failed to change password.'
        toast.error(message)
      }
    }
  })

  return (
    <AppModal
      open={open}
      onOpenChange={(val) => {
        if (!val) form.reset()
        onOpenChange(val)
      }}
      size='md'
      title='Change Password'
      description='Update your password to keep your account protected.'
      icon={<KeyRound className='size-5' />}
      footer={
        <div className='flex items-center justify-end gap-2.5'>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={isPending}>
            Cancel
          </Button>
          <Button
            type='button'
            disabled={isPending}
            onClick={() => form.handleSubmit()}>
            {isPending && <LoaderCircle className='mr-2 size-4 animate-spin' />}
            {isLoggingIn ? 'Refreshing session...' : 'Update Password'}
          </Button>
        </div>
      }>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className='space-y-4 pt-1'>
        <form.Field
          name='oldPassword'
          validators={{
            onChange: ({ value }) =>
              !value ? 'Current password is required' : undefined
          }}>
          {(field) => (
            <AppField
              field={field}
              label='Current Password'
              type='password'
              placeholder='Enter your current password'
              disabled={isPending}
            />
          )}
        </form.Field>

        <form.Field
          name='newPassword'
          validators={{
            onChange: ({ value }) =>
              !value || value.length < 8
                ? 'Password must be at least 8 characters'
                : undefined
          }}>
          {(field) => (
            <AppField
              field={field}
              label='New Password'
              type='password'
              placeholder='Enter new password (min. 8 chars)'
              disabled={isPending}
            />
          )}
        </form.Field>

        <form.Field
          name='confirmPassword'
          validators={{
            onChangeListenTo: ['newPassword'],
            onChange: ({ value, fieldApi }) => {
              const newPass = fieldApi.form.getFieldValue('newPassword')
              return value !== newPass ? 'Passwords do not match' : undefined
            }
          }}>
          {(field) => (
            <AppField
              field={field}
              label='Confirm New Password'
              type='password'
              placeholder='Re-type new password'
              disabled={isPending}
            />
          )}
        </form.Field>
      </form>
    </AppModal>
  )
}

export default ChangePasswordModal
