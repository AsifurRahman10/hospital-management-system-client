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
import { toast } from '@/components/ui/toast'
import { deleteDoctor } from '@/service/doctor.service'
import { type IDoctor } from '@/types/doctor.types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

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
      toast.add({
        title: 'Error',
        description: 'Doctor data is not available.'
      })
      return
    }

    const result = await mutateAsync(String(doctor.id))

    if (!result.success) {
      toast.add({
        title: 'Error',
        description: result.message || 'Failed to delete doctor'
      })
      return
    }

    toast.add({
      title: 'Success',
      description: result.message || 'Doctor deleted successfully'
    })
    onOpenChange(false)

    void queryClient.invalidateQueries({ queryKey: ['doctors'] })
    void queryClient.refetchQueries({ queryKey: ['doctors'], type: 'active' })
    router.refresh()
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
