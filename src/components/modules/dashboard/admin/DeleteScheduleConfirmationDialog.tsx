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
import { deleteSchedule } from '@/service/schedule.service'
import { ISchedule } from '@/types/schedule.types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface DeleteScheduleConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  schedule: ISchedule | null
}

const DeleteScheduleConfirmationDialog = ({
  open,
  onOpenChange,
  schedule
}: DeleteScheduleConfirmationDialogProps) => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { mutateAsync, isPending } = useMutation({ mutationFn: deleteSchedule })

  const handleConfirmDelete = async () => {
    if (!schedule) {
      toast.error('Schedule data is not available.')
      return
    }

    try {
      const result = await mutateAsync(schedule.id)
      if (!result.success) {
        toast.error(result.message || 'Failed to delete schedule')
        return
      }

      toast.success(result.message || 'Schedule deleted successfully')
      onOpenChange(false)
      await queryClient.invalidateQueries({ queryKey: ['schedules'] })
      router.refresh()
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Something went wrong while deleting the schedule.'
      )
    }
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Schedule</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this schedule? Linked doctor slots
            and appointments may be affected.
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
            {isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteScheduleConfirmationDialog
