'use client'

import AppModal from '@/components/shared/AppModal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { getMyAppointments } from '@/service/appointment.service'
import { createPrescription } from '@/service/prescription.service'
import { IAppointment } from '@/types/appointment.type'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addDays, format } from 'date-fns'
import {
  Calendar,
  CheckCircle2,
  FilePlus,
  FileText,
  LoaderCircle,
  Plus,
  Sparkles,
  User
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

const TEMPLATES = [
  {
    label: 'Standard Follow-up',
    text: 'Take the prescribed medication as directed by your doctor. Drink plenty of water, get adequate rest, and avoid self-medication. If symptoms persist or worsen, contact your healthcare provider. Attend your follow-up appointment as scheduled.'
  },
  {
    label: 'Post-Consultation Care',
    text: 'Complete the full course of antibiotics as prescribed. Maintain a light and nutritious diet. Avoid strenuous physical activity for the next 48 hours. Monitor your body temperature daily and report any adverse reactions immediately.'
  },
  {
    label: 'Dietary & Lifestyle Advice',
    text: 'Reduce dietary sodium and refined sugars. Engage in moderate exercise (walking 30 minutes daily). Stay well-hydrated and maintain regular sleep hygiene. Repeat the advised blood tests prior to the follow-up visit.'
  }
]

const CreatePrescriptionModal = () => {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const router = useRouter()

  // Fetch doctor's appointments
  const { data: appointmentsResponse, isLoading: isLoadingAppointments } =
    useQuery({
      queryKey: ['my-appointments-paid'],
      queryFn: () => getMyAppointments(),
      enabled: open
    })

  // Filter only appointments with paymentStatus === 'PAID'
  const paidAppointments = useMemo(() => {
    if (!appointmentsResponse) return []
    const raw = appointmentsResponse.data
    const list: IAppointment[] = Array.isArray(raw)
      ? raw
      : raw && typeof raw === 'object' && 'data' in raw && Array.isArray((raw as unknown as { data: IAppointment[] }).data)
        ? (raw as unknown as { data: IAppointment[] }).data
        : []

    return list.filter((app) => {
      const status = String(app.paymentStatus || '').toUpperCase()
      return status === 'PAID'
    })
  }, [appointmentsResponse])

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createPrescription
  })

  const defaultFollowUp = useMemo(
    () => format(addDays(new Date(), 7), 'yyyy-MM-dd'),
    []
  )

  const form = useForm({
    defaultValues: {
      appointmentId: '',
      instructions: TEMPLATES[0].text,
      followUpDate: defaultFollowUp
    },
    onSubmit: async ({ value }) => {
      if (!value.appointmentId) {
        toast.error('Please select an appointment/patient.')
        return
      }
      if (!value.instructions.trim()) {
        toast.error('Please enter prescription instructions.')
        return
      }
      if (!value.followUpDate) {
        toast.error('Please choose a follow-up consultation date.')
        return
      }

      try {
        const result = await mutateAsync({
          appointmentId: value.appointmentId,
          instructions: value.instructions.trim(),
          followUpDate: value.followUpDate
        })

        if (result && 'success' in result && !result.success) {
          toast.error(
            (result as { message?: string }).message ||
              'Failed to create prescription'
          )
          return
        }

        toast.success('Prescription created and issued successfully!')
        setOpen(false)
        form.reset()
        await queryClient.invalidateQueries({
          queryKey: ['my-prescriptions']
        })
        router.refresh()
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Failed to create prescription.'
        )
      }
    }
  })

  // Selected appointment details for preview
  const selectedAppointment = useMemo(() => {
    const id = form.state.values.appointmentId
    return paidAppointments.find((app) => app.id === id)
  }, [form.state.values.appointmentId, paidAppointments])

  return (
    <AppModal
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) {
          form.reset()
        }
      }}
      size='2xl'
      title='Create New Prescription'
      description='Issue medical instructions and prescribe treatments for a patient appointment.'
      icon={<FilePlus className='size-5 text-primary' />}
      trigger={
        <Button className='gap-2 shadow-xs'>
          <Plus className='size-4' />
          New Prescription
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
            onClick={() => form.handleSubmit()}
            className='gap-2'>
            {isPending && (
              <LoaderCircle className='size-4 animate-spin' />
            )}
            {isPending ? 'Issuing Prescription...' : 'Issue Prescription'}
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
        {/* Step 1: Appointment & Patient Select */}
        <form.Field name='appointmentId'>
          {(field) => (
            <div className='space-y-1.5'>
              <div className='flex items-center justify-between'>
                <Label
                  htmlFor='appointmentId'
                  className='flex items-center gap-1.5 text-xs font-semibold text-foreground'>
                  <User className='size-3.5 text-primary' /> Select Patient
                  Appointment
                </Label>
                <span className='text-[11px] text-muted-foreground'>
                  Only paid appointments eligible
                </span>
              </div>

              <Select
                value={field.state.value}
                onValueChange={(val) => field.handleChange(val || '')}
                disabled={isPending || isLoadingAppointments}>
                <SelectTrigger
                  id='appointmentId'
                  className='w-full'>
                  <SelectValue
                    placeholder={
                      isLoadingAppointments
                        ? 'Loading paid appointments...'
                        : paidAppointments.length === 0
                          ? 'No paid appointments found'
                          : 'Choose a patient appointment'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {paidAppointments.map((app) => {
                    const patientName = app.patient?.name || 'Unnamed Patient'
                    const patientEmail = app.patient?.email || ''
                    const scheduleDate = app.schedule?.startDateTime
                      ? format(
                          new Date(app.schedule.startDateTime),
                          'MMM dd, yyyy'
                        )
                      : 'Date N/A'

                    return (
                      <SelectItem
                        key={app.id}
                        value={app.id}>
                        <div className='flex flex-col py-0.5 text-left'>
                          <span className='font-medium text-foreground'>
                            {patientName}{' '}
                            <span className='text-xs text-muted-foreground'>
                              ({scheduleDate})
                            </span>
                          </span>
                          <span className='text-xs text-muted-foreground'>
                            {patientEmail} · ID: {app.id.slice(0, 8)}
                          </span>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          )}
        </form.Field>

        {/* Selected Appointment Preview Card */}
        {selectedAppointment && (
          <div className='flex items-center justify-between rounded-xl border border-primary/30 bg-primary/5 p-3 text-xs'>
            <div className='space-y-0.5'>
              <p className='font-semibold text-foreground'>
                Patient: {selectedAppointment.patient?.name || 'N/A'}
              </p>
              <p className='text-muted-foreground'>
                {selectedAppointment.patient?.email} · Phone:{' '}
                {selectedAppointment.patient?.contactNumber || 'N/A'}
              </p>
            </div>
            <Badge
              variant='outline'
              className='bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'>
              <CheckCircle2 className='mr-1 size-3 text-emerald-600' /> Paid
            </Badge>
          </div>
        )}

        {/* Step 2: Follow-up Date */}
        <form.Field name='followUpDate'>
          {(field) => (
            <div className='space-y-1.5'>
              <Label
                htmlFor='followUpDate'
                className='flex items-center gap-1.5 text-xs font-semibold text-foreground'>
                <Calendar className='size-3.5 text-primary' /> Follow-up Date
              </Label>
              <Input
                id='followUpDate'
                type='date'
                min={format(new Date(), 'yyyy-MM-dd')}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                disabled={isPending}
                required
              />
            </div>
          )}
        </form.Field>

        {/* Step 3: Medical Instructions & Quick Presets */}
        <form.Field name='instructions'>
          {(field) => (
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label
                  htmlFor='instructions'
                  className='flex items-center gap-1.5 text-xs font-semibold text-foreground'>
                  <FileText className='size-3.5 text-primary' /> Prescription
                  Instructions & Advice
                </Label>
                <span className='text-[11px] text-muted-foreground'>
                  Include dosages, medicines & guidance
                </span>
              </div>

              {/* Quick Template Buttons */}
              <div className='flex flex-wrap items-center gap-1.5 rounded-lg border border-border/60 bg-muted/30 p-2'>
                <span className='flex items-center gap-1 text-[11px] font-semibold text-muted-foreground'>
                  <Sparkles className='size-3 text-amber-500' /> Quick Presets:
                </span>
                {TEMPLATES.map((tmpl, index) => (
                  <Button
                    key={index}
                    type='button'
                    variant='outline'
                    size='sm'
                    className='h-6 px-2 text-[10px]'
                    onClick={() => field.handleChange(tmpl.text)}>
                    {tmpl.label}
                  </Button>
                ))}
              </div>

              <Textarea
                id='instructions'
                rows={5}
                placeholder='Specify medications, dosages, frequency, diet, and lifestyle restrictions...'
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

export default CreatePrescriptionModal
