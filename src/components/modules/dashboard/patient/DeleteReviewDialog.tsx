'use client'

import AppModal from '@/components/shared/AppModal'
import { Button } from '@/components/ui/button'
import { deleteReview } from '@/service/review.service'
import { IReview } from '@/types/review.type'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AlertTriangle, LoaderCircle, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

interface DeleteReviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  review: IReview | null
}

export const DeleteReviewDialog = ({
  open,
  onOpenChange,
  review
}: DeleteReviewDialogProps) => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteReview
  })

  const handleConfirmDelete = async () => {
    if (!review?.id) {
      toast.error('Review identifier not found.')
      return
    }

    try {
      const result = await mutateAsync(review.id)
      if (result && 'success' in result && result.success === false) {
        toast.error(
          (result as { message?: string }).message || 'Failed to delete review'
        )
        return
      }

      toast.success('Review deleted successfully')
      onOpenChange(false)
      await queryClient.invalidateQueries({
        queryKey: ['my-reviews']
      })
      await queryClient.invalidateQueries({
        queryKey: ['reviews']
      })
      router.refresh()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to delete review.'
      )
    }
  }

  const doctorName = review?.doctor?.name || 'this doctor'

  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      size='md'
      title='Delete Consultation Review'
      description='Are you sure you want to delete this doctor review?'
      icon={<Trash2 className='size-5 text-destructive' />}
      footer={
        <div className='flex w-full items-center justify-end gap-2.5'>
          <Button
            type='button'
            variant='outline'
            size='sm'
            disabled={isPending}
            onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type='button'
            size='sm'
            disabled={isPending}
            onClick={handleConfirmDelete}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'>
            {isPending && <LoaderCircle className='mr-1.5 size-4 animate-spin' />}
            <span>{isPending ? 'Deleting...' : 'Delete Review'}</span>
          </Button>
        </div>
      }>
      <div className='space-y-3 py-2 text-xs text-muted-foreground'>
        <div className='flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive/5 p-3.5 text-foreground'>
          <AlertTriangle className='mt-0.5 size-4 shrink-0 text-destructive' />
          <p className='leading-relaxed'>
            This will permanently remove your feedback, comment, and rating
            submitted for <span className='font-bold'>Dr. {doctorName}</span>. This
            action cannot be undone.
          </p>
        </div>
      </div>
    </AppModal>
  )
}

export default DeleteReviewDialog
