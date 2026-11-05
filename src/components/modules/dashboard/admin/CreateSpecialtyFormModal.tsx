'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createSpecialty } from '@/service/specialty.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FormEvent, useRef, useState } from 'react'
import { toast } from 'sonner'

const CreateSpecialtyFormModal = () => {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const queryClient = useQueryClient()
  const router = useRouter()
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createSpecialty
  })

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!title.trim()) {
      toast.error('Specialty title is required.')
      return
    }

    try {
      const formData = new FormData()
      formData.append('title', title.trim())
      if (description.trim()) {
        formData.append('description', description.trim())
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
      resetForm()
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

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) resetForm()
      }}>
      <DialogTrigger
        render={
          <Button
            type='button'
            className='ml-auto shrink-0 h-9'>
            <Plus className='mr-1.5 size-4' />
            Add Specialty
          </Button>
        }
      />
      <DialogContent className='sm:max-w-[480px]'>
        <form
          onSubmit={handleSubmit}
          className='space-y-4'>
          <DialogHeader>
            <DialogTitle>Add New Specialty</DialogTitle>
            <DialogDescription>
              Create a new medical specialty for practitioner profiles.
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-3 py-2'>
            <div className='space-y-1.5'>
              <Label htmlFor='specialty-title'>Specialty Title *</Label>
              <Input
                id='specialty-title'
                placeholder='e.g. Cardiology, Neurology'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={isPending}
              />
            </div>

            <div className='space-y-1.5'>
              <Label htmlFor='specialty-description'>
                Description (Optional)
              </Label>
              <Textarea
                id='specialty-description'
                placeholder='Brief description of the medical specialty...'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isPending}
                rows={3}
              />
            </div>

            <div className='space-y-1.5'>
              <Label htmlFor='specialty-image'>
                Specialty Icon / Image (Optional)
              </Label>
              <Input
                id='specialty-image'
                ref={fileInputRef}
                type='file'
                accept='image/*'
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                disabled={isPending}
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
              {isPending ? 'Creating...' : 'Create Specialty'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateSpecialtyFormModal
