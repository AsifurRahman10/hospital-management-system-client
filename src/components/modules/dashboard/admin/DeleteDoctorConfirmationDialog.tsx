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
import { deleteDoctor } from '@/service/doctor.service'
import { type IDoctor } from '@/types/doctor.types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface DeleteDoctorConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  doctor: IDoctor | null
}

const DeleteDoctorConfirmationDialog = ({
  open,
  onOpenChange,
  doctor
}: DeleteDoctorConfirmationDialogProps) => {
  const queryClient = useQueryClient()
  const router = useRouter()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteDoctor
  })

  const handleConfirmDelete = async () => {
    if (!doctor) {
      toast.error('Doctor data is not available.')
      return
    }

    try {
      const result = await mutateAsync(String(doctor.id))

      if (!result.success) {
        toast.error(result.message || 'Failed to delete doctor')
        return
      }

      toast.success(result.message || 'Doctor deleted successfully')

      onOpenChange(false)

      await queryClient.invalidateQueries({
        queryKey: ['doctors']
      })

      router.refresh()
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Something went wrong while deleting the doctor.'
      )
    }
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Doctor</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {doctor?.name ?? 'this doctor'}?
            This action will mark the doctor and linked user as deleted.
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

export default DeleteDoctorConfirmationDialog
