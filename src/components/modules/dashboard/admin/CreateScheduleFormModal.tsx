'use client'

import AppModal from '@/components/shared/AppModal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createSchedule } from '@/service/schedule.service'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { CalendarClock, Clock, LoaderCircle, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

const getTodayString = () => format(new Date(), 'yyyy-MM-dd')

const CreateScheduleFormModal = () => {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const router = useRouter()
  const { mutateAsync, isPending } = useMutation({ mutationFn: createSchedule })

  const form = useForm({
    defaultValues: {
      startDate: getTodayString(),
      endDate: getTodayString(),
      startTime: '09:00',
      endTime: '17:00'
    },
    onSubmit: async ({ value }) => {
      if (
        !value.startDate ||
        !value.endDate ||
        !value.startTime ||
        !value.endTime
      ) {
        toast.error('Please enter all dates and 24-hour times.')
        return
      }

      if (
        value.startDate === value.endDate &&
        value.endTime <= value.startTime
      ) {
        toast.error('End time must be after start time for the same date.')
        return
      }

      if (value.endDate < value.startDate) {
        toast.error('End date cannot be earlier than start date.')
        return
      }

      try {
        const result = await mutateAsync({
          startDate: value.startDate,
          endDate: value.endDate,
          startTime: value.startTime,
          endTime: value.endTime
        })
        if (!result.success) {
          toast.error(result.message || 'Failed to create schedule')
          return
        }

        toast.success(result.message || 'Schedule created successfully')
        setOpen(false)
        form.reset()
        await queryClient.invalidateQueries({ queryKey: ['schedules'] })
        router.refresh()
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Something went wrong while creating the schedule.'
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
        }
      }}
      size='md'
      title='Create Schedule'
      description='Add a 24-hour schedule window for doctor appointments.'
      icon={<CalendarClock className='size-5' />}
      trigger={
        <Button
          type='button'
          className='ml-auto h-9 shrink-0'>
          <Plus className='size-4' />
          Create Schedule
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
            {isPending ? 'Creating...' : 'Create Schedule'}
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
        {/* Date Selection */}
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
          <form.Field name='startDate'>
            {(field) => (
              <div className='space-y-1.5'>
                <Label
                  htmlFor='startDate'
                  className='text-xs font-medium text-muted-foreground'>
                  Start Date
                </Label>
                <Input
                  id='startDate'
                  type='date'
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  disabled={isPending}
                  required
                />
              </div>
            )}
          </form.Field>

          <form.Field name='endDate'>
            {(field) => (
              <div className='space-y-1.5'>
                <Label
                  htmlFor='endDate'
                  className='text-xs font-medium text-muted-foreground'>
                  End Date
                </Label>
                <Input
                  id='endDate'
                  type='date'
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  disabled={isPending}
                  required
                />
              </div>
            )}
          </form.Field>
        </div>

        {/* 24-Hour Time Window */}
        <div className='space-y-1.5'>
          <div className='flex items-center justify-between'>
            <Label className='flex items-center gap-1.5 text-xs font-semibold text-foreground'>
              <Clock className='size-3.5 text-primary' /> 24-Hour Consultation
              Time
            </Label>
            <span className='text-[11px] text-muted-foreground'>
              24-hour format (00:00 — 23:59)
            </span>
          </div>

          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
            <form.Field name='startTime'>
              {(field) => (
                <div className='space-y-1'>
                  <Label
                    htmlFor='startTime'
                    className='text-[11px] font-medium text-muted-foreground'>
                    Start Time (24h)
                  </Label>
                  <Input
                    id='startTime'
                    type='time'
                    step='60'
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    disabled={isPending}
                    required
                  />
                </div>
              )}
            </form.Field>

            <form.Field name='endTime'>
              {(field) => (
                <div className='space-y-1'>
                  <Label
                    htmlFor='endTime'
                    className='text-[11px] font-medium text-muted-foreground'>
                    End Time (24h)
                  </Label>
                  <Input
                    id='endTime'
                    type='time'
                    step='60'
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    disabled={isPending}
                    required
                  />
                </div>
              )}
            </form.Field>
          </div>
        </div>

        {/* 24-Hour Quick Presets */}
        <div className='space-y-1.5 rounded-lg border border-border/60 bg-muted/30 p-2.5'>
          <p className='text-[11px] font-semibold text-muted-foreground'>
            Quick 24-Hour Presets:
          </p>
          <div className='flex flex-wrap gap-1.5'>
            <Button
              type='button'
              variant='outline'
              size='sm'
              className='h-7 text-xs'
              onClick={() => {
                form.setFieldValue('startTime', '09:00')
                form.setFieldValue('endTime', '17:00')
              }}>
              09:00 — 17:00 (Office)
            </Button>
            <Button
              type='button'
              variant='outline'
              size='sm'
              className='h-7 text-xs'
              onClick={() => {
                form.setFieldValue('startTime', '08:00')
                form.setFieldValue('endTime', '13:00')
              }}>
              08:00 — 13:00 (Morning)
            </Button>
            <Button
              type='button'
              variant='outline'
              size='sm'
              className='h-7 text-xs'
              onClick={() => {
                form.setFieldValue('startTime', '13:00')
                form.setFieldValue('endTime', '18:00')
              }}>
              13:00 — 18:00 (Afternoon)
            </Button>
            <Button
              type='button'
              variant='outline'
              size='sm'
              className='h-7 text-xs'
              onClick={() => {
                form.setFieldValue('startTime', '18:00')
                form.setFieldValue('endTime', '22:00')
              }}>
              18:00 — 22:00 (Night)
            </Button>
          </div>
        </div>
      </form>
    </AppModal>
  )
}

export default CreateScheduleFormModal
