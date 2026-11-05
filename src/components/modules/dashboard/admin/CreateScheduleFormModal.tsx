'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { createSchedule } from '@/service/schedule.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'
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
  const [startDateTime, setStartDateTime] = useState(getDefaultDateTime())
  const [endDateTime, setEndDateTime] = useState(getDefaultDateTime(30))
  const queryClient = useQueryClient()
  const router = useRouter()
  const { mutateAsync, isPending } = useMutation({ mutationFn: createSchedule })

  const resetForm = () => {
    setStartDateTime(getDefaultDateTime())
    setEndDateTime(getDefaultDateTime(30))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const start = new Date(startDateTime)
    const end = new Date(endDateTime)
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      toast.error('Enter valid schedule dates and times.')
      return
    }
    if (end <= start) {
      toast.error('End time must be after start time.')
      return
    }

    try {
      const startParts = splitDateTime(startDateTime)
      const endParts = splitDateTime(endDateTime)
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
      resetForm()
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
            <Plus className='size-4' />
            Create Schedule
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Schedule</DialogTitle>
          <DialogDescription>
            Add a schedule window for doctor appointments.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className='space-y-4'>
          <label className='block space-y-1.5 text-sm font-medium'>
            Start date and time
            <Input
              type='datetime-local'
              value={startDateTime}
              onChange={(event) => setStartDateTime(event.target.value)}
              required
            />
          </label>
          <label className='block space-y-1.5 text-sm font-medium'>
            End date and time
            <Input
              type='datetime-local'
              value={endDateTime}
              onChange={(event) => setEndDateTime(event.target.value)}
              required
            />
          </label>
          <div className='flex justify-end gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setOpen(false)}
              disabled={isPending}>
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={isPending}>
              {isPending ? 'Creating...' : 'Create schedule'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateScheduleFormModal
