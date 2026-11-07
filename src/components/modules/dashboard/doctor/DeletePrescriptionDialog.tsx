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
import { deletePrescription } from '@/service/prescription.service'
import { IPrescription } from '@/types/prescription.type'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface DeletePrescriptionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  prescription: IPrescription | null
}

const DeletePrescriptionDialog = ({
  open,
  onOpenChange,
  prescription
}: DeletePrescriptionDialogProps) => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { mutateAsync, isPending } = useMutation({
    mutationFn: deletePrescription
  })

  const handleConfirmDelete = async () => {
    if (!prescription?.id) {
      toast.error('Prescription identifier not found.')
      return
    }

    try {
      const result = await mutateAsync(prescription.id)
      if (result && 'success' in result && !result.success) {
        toast.error(
          (result as { message?: string }).message ||
            'Failed to delete prescription'
        )
        return
      }

      toast.success('Prescription deleted successfully')
      onOpenChange(false)
      await queryClient.invalidateQueries({
        queryKey: ['my-prescriptions']
      })
      router.refresh()
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to delete prescription.'
      )
    }
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Prescription</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this prescription? This action
            cannot be undone and the patient will no longer be able to access
            it.
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

export default DeletePrescriptionDialog
