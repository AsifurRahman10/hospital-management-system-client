'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { updateSpecialty } from '@/service/specialty.service'
import { ISpecialty } from '@/types/specialty.types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'
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
  const [title, setTitle] = useState(specialty.title || '')
  const [description, setDescription] = useState(specialty.description || '')

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!title.trim()) {
      toast.error('Specialty title is required.')
      return
    }

    try {
      const result = await mutateAsync({
        id: specialty.id,
        payload: {
          title: title.trim(),
          description: description.trim() || undefined
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

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-4'>
      <DialogHeader>
        <DialogTitle>Edit Specialty</DialogTitle>
        <DialogDescription>
          Update information for this medical specialty.
        </DialogDescription>
      </DialogHeader>

      <div className='space-y-3 py-2'>
        <div className='space-y-1.5'>
          <Label htmlFor='edit-specialty-title'>Specialty Title *</Label>
          <Input
            id='edit-specialty-title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={isPending}
          />
        </div>

        <div className='space-y-1.5'>
          <Label htmlFor='edit-specialty-description'>
            Description (Optional)
          </Label>
          <Textarea
            id='edit-specialty-description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isPending}
            rows={3}
          />
        </div>
      </div>

      <DialogFooter>
        <DialogClose
          render={
            <Button
              type='button'
              variant='outline'
              disabled={isPending}>
              Cancel
            </Button>
          }
        />
        <Button
          type='submit'
          disabled={isPending}>
          {isPending ? 'Updating...' : 'Save Changes'}
        </Button>
      </DialogFooter>
    </form>
  )
}

const EditSpecialtyModal = ({
  open,
  onOpenChange,
  specialty
}: EditSpecialtyModalProps) => {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[480px]'>
        {specialty ? (
          <EditSpecialtyContent
            key={specialty.id}
            specialty={specialty}
            onOpenChange={onOpenChange}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

export default EditSpecialtyModal
