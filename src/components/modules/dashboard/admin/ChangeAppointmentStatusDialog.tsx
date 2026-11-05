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
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { AppointmentStatus } from '@/types/appointment.type'

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
    <Dialog
      open={open}
      onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change appointment status</DialogTitle>
          <DialogDescription>
            Choose the new appointment status for{' '}
            <span className='font-medium text-foreground'>
              {patientName ?? 'the patient'}
            </span>
            {doctorName ? ` with ${doctorName}` : ''}.
          </DialogDescription>
        </DialogHeader>

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
              <SelectItem value={AppointmentStatus.SCHEDULED}>
                Scheduled
              </SelectItem>
              <SelectItem value={AppointmentStatus.INPROGRESS}>
                In Progress
              </SelectItem>
              <SelectItem value={AppointmentStatus.COMPLETED}>
                Completed
              </SelectItem>
              <SelectItem value={AppointmentStatus.CANCELED}>
                Canceled
              </SelectItem>
            </SelectContent>
          </Select>
          <p className='text-xs text-muted-foreground'>
            As an administrator, you have permission to update appointments to
            any status.
          </p>
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
            type='button'
            onClick={onSubmit}
            disabled={isPending}>
            {isPending ? 'Updating...' : 'Update status'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ChangeAppointmentStatusDialog
