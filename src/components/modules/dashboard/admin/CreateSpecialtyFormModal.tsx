'use client'

import AppField from '@/components/shared/AppField'
import AppModal from '@/components/shared/AppModal'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createSpecialty } from '@/service/specialty.service'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { LoaderCircle, Plus, Stethoscope } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

const CreateSpecialtyFormModal = () => {
  const [open, setOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const queryClient = useQueryClient()
  const router = useRouter()
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createSpecialty
  })

  const form = useForm({
    defaultValues: {
      title: '',
      description: ''
    },
    onSubmit: async ({ value }) => {
      if (!value.title.trim()) {
        toast.error('Specialty title is required.')
        return
      }

      try {
        const formData = new FormData()
        formData.append('title', value.title.trim())
        if (value.description.trim()) {
          formData.append('description', value.description.trim())
        }
        if (selectedFile) {
          formData.append('image', selectedFile)
        }

        const result = await mutateAsync(formData)

        if (!result.success) {
          toast.error(result.message || 'Failed to create specialty')
          return
        }

        toast.success(result.message || 'Specialty created successfully')
        setOpen(false)
        form.reset()
        setSelectedFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        await queryClient.invalidateQueries({ queryKey: ['specialties'] })
        router.refresh()
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Something went wrong while creating the specialty.'
        )
      }
    }
  })

  return (
    <AppModal
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) {
          form.reset()
          setSelectedFile(null)
          if (fileInputRef.current) {
            fileInputRef.current.value = ''
          }
        }
      }}
      size='md'
      title='Add New Specialty'
      description='Create a new medical specialty for practitioner profiles.'
      icon={<Stethoscope className='size-5' />}
      trigger={
        <Button
          type='button'
          className='ml-auto h-9 shrink-0'>
          <Plus className='mr-1.5 size-4' />
          Add Specialty
        </Button>
      }
      footer={
        <div className='flex items-center justify-end gap-2.5'>
          <Button
            type='button'
            variant='outline'
            onClick={() => setOpen(false)}
            disabled={isPending}>
            Cancel
          </Button>
          <Button
            type='button'
            disabled={isPending}
            onClick={() => form.handleSubmit()}>
            {isPending && <LoaderCircle className='mr-2 size-4 animate-spin' />}
            {isPending ? 'Creating...' : 'Create Specialty'}
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
          name='title'
          validators={{
            onChange: ({ value }) =>
              !value.trim() ? 'Specialty title is required' : undefined
          }}>
          {(field) => (
            <AppField
              field={field}
              label='Specialty Title *'
              placeholder='e.g. Cardiology, Neurology'
              disabled={isPending}
            />
          )}
        </form.Field>

        <form.Field name='description'>
          {(field) => (
            <div className='space-y-1.5'>
              <Label
                htmlFor='specialty-description'
                className='text-xs font-medium text-muted-foreground'>
                Description (Optional)
              </Label>
              <Textarea
                id='specialty-description'
                placeholder='Brief description of the medical specialty...'
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                disabled={isPending}
                rows={3}
              />
            </div>
          )}
        </form.Field>

        <div className='space-y-1.5'>
          <Label
            htmlFor='specialty-image'
            className='text-xs font-medium text-muted-foreground'>
            Specialty Icon / Image (Optional)
          </Label>
          <input
            id='specialty-image'
            ref={fileInputRef}
            type='file'
            accept='image/*'
            className='block w-full text-xs file:mr-4 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-primary hover:file:bg-primary/20'
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            disabled={isPending}
          />
        </div>
      </form>
    </AppModal>
  )
}

export default CreateSpecialtyFormModal
