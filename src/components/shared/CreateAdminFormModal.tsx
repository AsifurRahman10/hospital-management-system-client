'use client'

import AppField from '@/components/shared/AppField'
import AppModal from '@/components/shared/AppModal'
import AppSubmitButton from '@/components/modules/dashboard/AppSubmitButton'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { createAdmin, createSuperAdmin } from '@/service/admin.service'
import {
  createAdminFormSchema,
  CreateAdminFormValues
} from '@/validation/admin.validation'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, ShieldAlert } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

const defaultValues: CreateAdminFormValues = {
  role: 'ADMIN',
  name: '',
  email: '',
  password: '',
  contactNumber: ''
}

const CreateAdminFormModal = () => {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (values: CreateAdminFormValues) =>
      values.role === 'ADMIN'
        ? createAdmin({
            password: values.password,
            admin: {
              name: values.name,
              email: values.email,
              contactNumber: values.contactNumber
            }
          })
        : createSuperAdmin({
            password: values.password,
            superAdmin: {
              name: values.name,
              email: values.email,
              contactNumber: values.contactNumber
            }
          }),
    onSuccess: async (result, values) => {
      if (!result.success) {
        toast.error(result.message || 'Failed to create administrator account')
        return
      }

      toast.success(
        result.message ||
          `${values.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'} account created successfully`
      )
      closeForm()
      await queryClient.invalidateQueries({ queryKey: ['admins'] })
      await queryClient.refetchQueries({ queryKey: ['admins'], type: 'active' })
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to create administrator account'
      )
    }
  })

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value)
    }
  })

  const closeForm = () => {
    setOpen(false)
    form.reset()
  }

  return (
    <AppModal
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) closeForm()
        else setOpen(true)
      }}
      size='xl'
      title='Create Administrator'
      description='Create an admin or super admin account. The user will be asked to change this temporary password after signing in.'
      icon={<ShieldAlert className='size-5' />}
      trigger={
        <Button type='button'>
          <Plus className='size-4' />
          Create Admin
        </Button>
      }>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          void form.handleSubmit()
        }}
        className='space-y-5'>
        <form.Field
          name='role'
          validators={{ onChange: createAdminFormSchema.shape.role }}>
          {(field) => (
            <div className='space-y-1.5'>
              <Label>Account role</Label>
              <Select
                value={field.state.value}
                onValueChange={(value) =>
                  field.handleChange(value as CreateAdminFormValues['role'])
                }>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select account role' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='ADMIN'>Admin</SelectItem>
                  <SelectItem value='SUPER_ADMIN'>Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </form.Field>

        <div className='grid gap-4 sm:grid-cols-2'>
          <form.Field
            name='name'
            validators={{ onChange: createAdminFormSchema.shape.name }}>
            {(field) => (
              <AppField
                field={field}
                label='Full Name'
                placeholder='Enter full name'
              />
            )}
          </form.Field>
          <form.Field
            name='email'
            validators={{ onChange: createAdminFormSchema.shape.email }}>
            {(field) => (
              <AppField
                field={field}
                label='Email'
                type='email'
                placeholder='admin@example.com'
              />
            )}
          </form.Field>
          <form.Field
            name='password'
            validators={{ onChange: createAdminFormSchema.shape.password }}>
            {(field) => (
              <AppField
                field={field}
                label='Temporary Password'
                type='password'
                placeholder='Enter temporary password'
              />
            )}
          </form.Field>
          <form.Field
            name='contactNumber'
            validators={{
              onChange: createAdminFormSchema.shape.contactNumber
            }}>
            {(field) => (
              <AppField
                field={field}
                label='Contact Number'
                placeholder='Enter contact number'
              />
            )}
          </form.Field>
        </div>

        <div className='flex items-center justify-end gap-2.5 pt-4'>
          <Button
            type='button'
            variant='outline'
            onClick={closeForm}
            disabled={mutation.isPending}>
            Cancel
          </Button>
          <AppSubmitButton
            isPending={mutation.isPending}
            pendingLabel='Creating...'
            className='sm:w-auto sm:min-w-44'>
            Create account
          </AppSubmitButton>
        </div>
      </form>
    </AppModal>
  )
}

export default CreateAdminFormModal
