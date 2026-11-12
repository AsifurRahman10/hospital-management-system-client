'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { changeAppointmentStatus } from '@/service/appointment.service'
import { AppointmentStatus, IAppointment } from '@/types/appointment.type'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AlertTriangle, Clock, Loader2, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface CancelAppointmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  appointment: IAppointment | null
  onSuccess?: () => void
}

const formatDateTime = (startDateTime?: string | Date) => {
  if (!startDateTime) return 'N/A'
  try {
    const d = new Date(startDateTime)
    return Number.isNaN(d.getTime())
      ? 'N/A'
      : d.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
  } catch {
    return 'N/A'
  }
}

const CancelAppointmentDialog = ({
  open,
  onOpenChange,
  appointment,
  onSuccess
}: CancelAppointmentDialogProps) => {
  const queryClient = useQueryClient()
  const router = useRouter()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (appointmentId: string) =>
      changeAppointmentStatus(appointmentId, AppointmentStatus.CANCELED)
  })

  const handleConfirmCancel = async () => {
    if (!appointment?.id) {
      toast.error('Appointment identifier not found.')
      return
    }

    try {
      const result = await mutateAsync(appointment.id)
      if (result && 'success' in result && !result.success) {
        toast.error(
          (result as { message?: string }).message ||
            'Failed to cancel appointment.'
        )
        return
      }

      toast.success('Appointment canceled successfully.')
      onOpenChange(false)
      onSuccess?.()
      await queryClient.invalidateQueries({
        queryKey: ['my-appointments']
      })
      await queryClient.invalidateQueries({
        queryKey: ['patient-dashboard-data']
      })
      router.refresh()
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Something went wrong while canceling the appointment.'
      )
    }
  }

  const doctorName = appointment?.doctor?.name || 'Your Doctor'
  const scheduleTime =
    appointment?.schedule?.startDateTime ||
    appointment?.doctorSchedule?.schedule?.startDateTime

  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}>
      <AlertDialogContent className='sm:max-w-[460px]'>
        <AlertDialogHeader>
          <div className='flex items-center gap-2.5 text-destructive'>
            <div className='rounded-full bg-destructive/10 p-2'>
              <AlertTriangle className='size-5' />
            </div>
            <AlertDialogTitle className='text-lg font-bold'>
              Cancel Appointment?
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className='pt-2 text-sm text-muted-foreground'>
            Are you sure you want to cancel this scheduled consultation? This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {appointment && (
          <div className='my-2 rounded-lg border border-border/80 bg-muted/40 p-3.5 space-y-2 text-xs'>
            <div className='flex items-center gap-2 text-foreground font-semibold'>
              <User className='size-3.5 text-primary' />
              <span>Dr. {doctorName}</span>
            </div>
            {scheduleTime && (
              <div className='flex items-center gap-2 text-muted-foreground'>
                <Clock className='size-3.5' />
                <span>{formatDateTime(scheduleTime)}</span>
              </div>
            )}
          </div>
        )}

        <AlertDialogFooter className='gap-2 sm:gap-0'>
          <AlertDialogCancel
            disabled={isPending}
            className='h-9 text-xs'>
            Keep Appointment
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              void handleConfirmCancel()
            }}
            disabled={isPending}
            className='h-9 bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs font-semibold'>
            {isPending ? (
              <>
                <Loader2 className='mr-1.5 size-3.5 animate-spin' />
                Canceling...
              </>
            ) : (
              'Yes, Cancel Appointment'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default CancelAppointmentDialog
