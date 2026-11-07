'use client'

import AppModal from '@/components/shared/AppModal'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { AppointmentStatus } from '@/types/appointment.type'
import { CalendarClock } from 'lucide-react'

interface ChangeAppointmentStatusDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patientName?: string
  doctorName?: string
  status: AppointmentStatus
  onStatusChange: (status: AppointmentStatus) => void
  onSubmit: () => void
  isPending?: boolean
}

const ChangeAppointmentStatusDialog = ({
  open,
  onOpenChange,
  patientName,
  doctorName,
  status,
  onStatusChange,
  onSubmit,
  isPending = false
}: ChangeAppointmentStatusDialogProps) => {
  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      size='md'
      title='Change appointment status'
      description={
        <span>
          Choose the new appointment status for{' '}
          <span className='font-medium text-foreground'>
            {patientName ?? 'the patient'}
          </span>
          {doctorName ? ` with ${doctorName}` : ''}.
        </span>
      }
      icon={<CalendarClock className='size-5' />}
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
            onClick={onSubmit}
            disabled={isPending}>
            {isPending ? 'Updating...' : 'Update status'}
          </Button>
        </div>
      }>
      <div className='space-y-2 py-2'>
        <Label htmlFor='appointment-status'>Appointment status</Label>
        <Select
          value={status}
          onValueChange={(value) =>
            onStatusChange(value as AppointmentStatus)
          }>
          <SelectTrigger
            id='appointment-status'
            className='w-full'>
            <SelectValue placeholder='Select appointment status' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={AppointmentStatus.SCHEDULED}>Scheduled</SelectItem>
            <SelectItem value={AppointmentStatus.INPROGRESS}>In Progress</SelectItem>
            <SelectItem value={AppointmentStatus.COMPLETED}>Completed</SelectItem>
            <SelectItem value={AppointmentStatus.CANCELED}>Canceled</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </AppModal>
  )
}

export default ChangeAppointmentStatusDialog
