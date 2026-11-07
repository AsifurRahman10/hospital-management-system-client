'use client'

import AppField from '@/components/shared/AppField'
import AppModal from '@/components/shared/AppModal'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { updateSpecialty } from '@/service/specialty.service'
import { ISpecialty } from '@/types/specialty.types'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { LoaderCircle, Stethoscope } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface EditSpecialtyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  specialty: ISpecialty | null
}

const EditSpecialtyContent = ({
  specialty,
  onOpenChange
}: {
  specialty: ISpecialty
  onOpenChange: (open: boolean) => void
}) => {
  const queryClient = useQueryClient()
  const router = useRouter()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({
      id,
      payload
    }: {
      id: string
      payload: { title: string; description?: string }
    }) => updateSpecialty(id, payload)
  })

  const form = useForm({
    defaultValues: {
      title: specialty.title || '',
      description: specialty.description || ''
    },
    onSubmit: async ({ value }) => {
      if (!value.title.trim()) {
        toast.error('Specialty title is required.')
        return
      }

      try {
        const result = await mutateAsync({
          id: specialty.id,
          payload: {
            title: value.title.trim(),
            description: value.description.trim() || undefined
          }
        })

        if (!result.success) {
          toast.error(result.message || 'Failed to update specialty')
          return
        }

        toast.success(result.message || 'Specialty updated successfully')
        onOpenChange(false)
        await queryClient.invalidateQueries({ queryKey: ['specialties'] })
        router.refresh()
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Something went wrong while updating the specialty.'
        )
      }
    }
  })

  return (
    <div className='space-y-4'>
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
                htmlFor='edit-specialty-description'
                className='text-xs font-medium text-muted-foreground'>
                Description (Optional)
              </Label>
              <Textarea
                id='edit-specialty-description'
                placeholder='Brief description of the medical specialty...'
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                disabled={isPending}
                rows={3}
              />
            </div>
          )}
        </form.Field>

        <div className='flex items-center justify-end gap-2.5 pt-2'>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={isPending}>
            Cancel
          </Button>
          <Button
            type='submit'
            disabled={isPending}>
            {isPending && <LoaderCircle className='mr-2 size-4 animate-spin' />}
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}

const EditSpecialtyModal = ({
  open,
  onOpenChange,
  specialty
}: EditSpecialtyModalProps) => {
  return (
    <AppModal
      open={open && Boolean(specialty)}
      onOpenChange={onOpenChange}
      size='md'
      title='Edit Specialty'
      description='Update information for this medical specialty.'
      icon={<Stethoscope className='size-5' />}>
      {specialty && (
        <EditSpecialtyContent
          key={specialty.id}
          specialty={specialty}
          onOpenChange={onOpenChange}
        />
      )}
    </AppModal>
  )
}

export default EditSpecialtyModal
