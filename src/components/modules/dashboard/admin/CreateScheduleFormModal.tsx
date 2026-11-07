'use client'

import AppModal from '@/components/shared/AppModal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createSchedule } from '@/service/schedule.service'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CalendarClock, LoaderCircle, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

const getDefaultDateTime = (offsetMinutes = 0) => {
  const date = new Date(Date.now() + offsetMinutes * 60000)
  date.setSeconds(0, 0)
  const timezoneOffset = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16)
}

const splitDateTime = (value: string) => {
  const [date, time] = value.split('T')
  return { date, time }
}

const CreateScheduleFormModal = () => {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const router = useRouter()
  const { mutateAsync, isPending } = useMutation({ mutationFn: createSchedule })

  const form = useForm({
    defaultValues: {
      startDateTime: getDefaultDateTime(),
      endDateTime: getDefaultDateTime(30)
    },
    onSubmit: async ({ value }) => {
      const start = new Date(value.startDateTime)
      const end = new Date(value.endDateTime)
      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        toast.error('Enter valid schedule dates and times.')
        return
      }
      if (end <= start) {
        toast.error('End time must be after start time.')
        return
      }

      try {
        const startParts = splitDateTime(value.startDateTime)
        const endParts = splitDateTime(value.endDateTime)
        const result = await mutateAsync({
          startDate: startParts.date,
          endDate: endParts.date,
          startTime: startParts.time,
          endTime: endParts.time
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
      description='Add a schedule window for doctor appointments.'
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
        <form.Field name='startDateTime'>
          {(field) => (
            <div className='space-y-1.5'>
              <Label
                htmlFor='startDateTime'
                className='text-xs font-medium text-muted-foreground'>
                Start date and time
              </Label>
              <Input
                id='startDateTime'
                type='datetime-local'
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                disabled={isPending}
                required
              />
            </div>
          )}
        </form.Field>

        <form.Field name='endDateTime'>
          {(field) => (
            <div className='space-y-1.5'>
              <Label
                htmlFor='endDateTime'
                className='text-xs font-medium text-muted-foreground'>
                End date and time
              </Label>
              <Input
                id='endDateTime'
                type='datetime-local'
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                disabled={isPending}
                required
              />
            </div>
          )}
        </form.Field>
      </form>
    </AppModal>
  )
}

export default CreateScheduleFormModal
