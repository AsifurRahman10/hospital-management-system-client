'use client'

import AppModal from '@/components/shared/AppModal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { updatePrescription } from '@/service/prescription.service'
import { IPrescription } from '@/types/prescription.type'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import {
  Calendar,
  Edit,
  FileText,
  LoaderCircle,
  User
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'

interface EditPrescriptionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  prescription: IPrescription | null
}

const formatIsoDate = (dateStr?: string) => {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    return Number.isNaN(d.getTime()) ? '' : format(d, 'yyyy-MM-dd')
  } catch {
    return ''
  }
}

const EditPrescriptionModal = ({
  open,
  onOpenChange,
  prescription
}: EditPrescriptionModalProps) => {
  const queryClient = useQueryClient()
  const router = useRouter()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({
      id,
      payload
    }: {
      id: string
      payload: { instructions: string; followUpDate: string }
    }) => updatePrescription(id, payload)
  })

  const form = useForm({
    defaultValues: {
      instructions: prescription?.instructions || '',
      followUpDate: formatIsoDate(prescription?.followUpDate)
    },
    onSubmit: async ({ value }) => {
      if (!prescription?.id) {
        toast.error('Prescription identifier missing.')
        return
      }

      if (!value.instructions.trim()) {
        toast.error('Please enter instructions.')
        return
      }

      if (!value.followUpDate) {
        toast.error('Please select a follow-up date.')
        return
      }

      try {
        const result = await mutateAsync({
          id: prescription.id,
          payload: {
            instructions: value.instructions.trim(),
            followUpDate: value.followUpDate
          }
        })

        if (result && 'success' in result && !result.success) {
          toast.error(
            (result as { message?: string }).message ||
              'Failed to update prescription'
          )
          return
        }

        toast.success('Prescription updated successfully!')
        onOpenChange(false)
        await queryClient.invalidateQueries({
          queryKey: ['my-prescriptions']
        })
        router.refresh()
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Failed to update prescription.'
        )
      }
    }
  })

  useEffect(() => {
    if (prescription) {
      form.setFieldValue('instructions', prescription.instructions || '')
      form.setFieldValue(
        'followUpDate',
        formatIsoDate(prescription.followUpDate)
      )
    }
  }, [prescription, form])

  if (!prescription) return null

  const patient = prescription.patient

  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      size='lg'
      title='Edit Prescription'
      description='Update medical advice, dosages, or follow-up consultation date.'
      icon={<Edit className='size-5 text-primary' />}
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
            onClick={() => form.handleSubmit()}
            className='gap-2'>
            {isPending && (
              <LoaderCircle className='size-4 animate-spin' />
            )}
            {isPending ? 'Updating...' : 'Save Changes'}
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
        {/* Patient Info Banner */}
        <div className='flex items-center justify-between rounded-xl border border-border/70 bg-muted/30 p-3.5 text-xs'>
          <div className='flex items-center gap-2.5'>
            <div className='flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary'>
              <User className='size-4' />
            </div>
            <div>
              <p className='font-bold text-foreground'>
                {patient?.name || 'Unnamed Patient'}
              </p>
              <p className='text-muted-foreground'>{patient?.email || 'N/A'}</p>
            </div>
          </div>
          <Badge
            variant='outline'
            className='font-mono text-[10px]'>
            ID: {prescription.id.slice(0, 8)}
          </Badge>
        </div>

        {/* Follow-up Date */}
        <form.Field name='followUpDate'>
          {(field) => (
            <div className='space-y-1.5'>
              <Label
                htmlFor='edit-followUpDate'
                className='flex items-center gap-1.5 text-xs font-semibold text-foreground'>
                <Calendar className='size-3.5 text-primary' /> Follow-up Date
              </Label>
              <Input
                id='edit-followUpDate'
                type='date'
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                disabled={isPending}
                required
              />
            </div>
          )}
        </form.Field>

        {/* Instructions */}
        <form.Field name='instructions'>
          {(field) => (
            <div className='space-y-1.5'>
              <Label
                htmlFor='edit-instructions'
                className='flex items-center gap-1.5 text-xs font-semibold text-foreground'>
                <FileText className='size-3.5 text-primary' /> Prescription
                Instructions
              </Label>
              <Textarea
                id='edit-instructions'
                rows={5}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                disabled={isPending}
                required
                className='leading-relaxed'
              />
            </div>
          )}
        </form.Field>
      </form>
    </AppModal>
  )
}

export default EditPrescriptionModal
