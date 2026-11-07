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
import { deleteOwnDoctorSchedule } from '@/service/doctorSchedule.service'
import { IDoctorSchedule } from '@/types/schedule.types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface DeleteDoctorScheduleConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  doctorSchedule: IDoctorSchedule | null
}

const DeleteDoctorScheduleConfirmationDialog = ({
  open,
  onOpenChange,
  doctorSchedule
}: DeleteDoctorScheduleConfirmationDialogProps) => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteOwnDoctorSchedule
  })

  const handleConfirmDelete = async () => {
    const targetId = doctorSchedule?.id || doctorSchedule?.scheduleId
    if (!targetId) {
      toast.error('Schedule identifier not found.')
      return
    }

    try {
      const result = await mutateAsync(targetId)
      if (result && 'success' in result && !result.success) {
        toast.error((result as { message?: string }).message || 'Failed to delete schedule')
        return
      }

      toast.success('Schedule removed successfully')
      onOpenChange(false)
      await queryClient.invalidateQueries({
        queryKey: ['doctor-wise-schedules']
      })
      await queryClient.invalidateQueries({
        queryKey: ['schedules']
      })
      router.refresh()
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to remove schedule slot.'
      )
    }
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Doctor Schedule</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove this schedule slot from your
            consultation hours? Patients will no longer be able to book this slot with you.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant='destructive'
            onClick={(event) => {
              event.preventDefault()
              void handleConfirmDelete()
            }}
            disabled={isPending}>
            {isPending ? 'Removing...' : 'Remove'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteDoctorScheduleConfirmationDialog
