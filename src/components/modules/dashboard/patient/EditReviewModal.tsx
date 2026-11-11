'use client'

import AppModal from '@/components/shared/AppModal'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { updateReview } from '@/service/review.service'
import { IReview } from '@/types/review.type'
import { updateReviewZodSchema } from '@/validation/review.validation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Edit3, LoaderCircle, Star } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'

interface EditReviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  review: IReview | null
}

const RATING_LABELS: Record<number, string> = {
  1: '1 - Poor',
  2: '2 - Fair',
  3: '3 - Good',
  4: '4 - Very Good',
  5: '5 - Excellent'
}

const EditReviewModalContent = ({
  open,
  onOpenChange,
  review
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  review: IReview
}) => {
  const [rating, setRating] = useState<number>(() => Number(review.rating) || 5)
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [comment, setComment] = useState<string>(() => review.comment || '')

  const queryClient = useQueryClient()
  const router = useRouter()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({
      id,
      payload
    }: {
      id: string
      payload: { rating?: number; comment?: string }
    }) => updateReview(id, payload)
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const parseResult = updateReviewZodSchema.safeParse({
      rating,
      comment: comment.trim()
    })

    if (!parseResult.success) {
      const firstError =
        parseResult.error.issues[0]?.message || 'Please provide valid values.'
      toast.error(firstError)
      return
    }

    try {
      const response = await mutateAsync({
        id: review.id,
        payload: {
          rating,
          comment: comment.trim()
        }
      })

      if (response && 'success' in response && response.success === false) {
        toast.error(response.message || 'Failed to update review.')
        return
      }

      toast.success('Your review was updated successfully.')
      onOpenChange(false)
      await queryClient.invalidateQueries({ queryKey: ['my-reviews'] })
      await queryClient.invalidateQueries({ queryKey: ['reviews'] })
      router.refresh()
    } catch (error) {
      console.error('Error updating review:', error)
      toast.error(
        error instanceof Error ? error.message : 'Failed to update review.'
      )
    }
  }

  const activeRating = hoverRating !== null ? hoverRating : rating
  const doctorName = review.doctor?.name || 'Doctor'

  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      size='md'
      title='Edit Review'
      description={`Update your feedback and rating for Dr. ${doctorName}.`}
      icon={<Edit3 className='size-5 text-primary' />}
      footer={
        <div className='flex w-full items-center justify-end gap-2'>
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
            onClick={handleSubmit}
            className='bg-primary text-white hover:bg-primary/90'>
            {isPending && (
              <LoaderCircle className='mr-1.5 size-4 animate-spin' />
            )}
            <span>{isPending ? 'Saving...' : 'Save Changes'}</span>
          </Button>
        </div>
      }>
      <form
        onSubmit={handleSubmit}
        className='space-y-4 pt-1'>
        {/* Interactive Star Rating */}
        <div className='rounded-xl border border-amber-200/60 bg-amber-50/40 p-4 dark:border-amber-900/40 dark:bg-amber-950/20 space-y-2'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300'>
              Updated Rating
            </span>
            <span className='text-xs font-semibold text-muted-foreground'>
              {RATING_LABELS[activeRating] || `${activeRating} Stars`}
            </span>
          </div>

          <div className='flex items-center gap-1.5'>
            {[1, 2, 3, 4, 5].map((starVal) => {
              const isFilled = starVal <= activeRating
              return (
                <button
                  key={starVal}
                  type='button'
                  onClick={() => setRating(starVal)}
                  onMouseEnter={() => setHoverRating(starVal)}
                  onMouseLeave={() => setHoverRating(null)}
                  className='rounded-md p-1 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary'>
                  <Star
                    className={`size-7 ${
                      isFilled
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-muted-foreground/30'
                    }`}
                  />
                </button>
              )
            })}
          </div>
        </div>

        {/* Comment Textarea */}
        <div className='space-y-1.5'>
          <Label
            htmlFor='edit-review-comment'
            className='text-xs font-semibold text-foreground'>
            Feedback & Experience Comment
          </Label>
          <Textarea
            id='edit-review-comment'
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={isPending}
            placeholder='Describe your doctor consultation experience...'
            className='resize-none rounded-xl text-xs'
          />
        </div>
      </form>
    </AppModal>
  )
}

export const EditReviewModal = ({
  open,
  onOpenChange,
  review
}: EditReviewModalProps) => {
  if (!review) return null

  return (
    <EditReviewModalContent
      key={review.id}
      open={open}
      onOpenChange={onOpenChange}
      review={review}
    />
  )
}

export default EditReviewModal
