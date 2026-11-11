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
import { Textarea } from '@/components/ui/textarea'
import { getMyAppointments } from '@/service/appointment.service'
import { createReview, ICreateReviewPayload } from '@/service/review.service'
import { IAppointment } from '@/types/appointment.type'
import { createReviewZodSchema } from '@/validation/review.validation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { LoaderCircle, Star, Stethoscope } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useMemo, useState } from 'react'
import { toast } from 'sonner'

interface GiveReviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  preselectedAppointmentId?: string
}

const RATING_LABELS: Record<number, string> = {
  1: '1 - Poor',
  2: '2 - Fair',
  3: '3 - Good',
  4: '4 - Very Good',
  5: '5 - Excellent'
}

export const GiveReviewModal = ({
  open,
  onOpenChange,
  preselectedAppointmentId
}: GiveReviewModalProps) => {
  const [appointmentId, setAppointmentId] = useState<string>(
    preselectedAppointmentId || ''
  )
  const [rating, setRating] = useState<number>(5)
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [comment, setComment] = useState<string>('')

  const queryClient = useQueryClient()
  const router = useRouter()

  // Fetch patient appointments
  const { data: appointmentsData, isLoading: isLoadingAppointments } = useQuery(
    {
      queryKey: ['my-appointments-for-review'],
      queryFn: () => getMyAppointments(),
      enabled: open
    }
  )

  const appointments: IAppointment[] = useMemo(() => {
    const raw = appointmentsData?.data
    if (Array.isArray(raw)) return raw
    if (
      raw &&
      typeof raw === 'object' &&
      'data' in raw &&
      Array.isArray((raw as unknown as { data: IAppointment[] }).data)
    ) {
      return (raw as unknown as { data: IAppointment[] }).data
    }
    return []
  }, [appointmentsData])

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: ICreateReviewPayload) => createReview(payload)
  })

  const resetForm = () => {
    setAppointmentId(preselectedAppointmentId || '')
    setRating(5)
    setHoverRating(null)
    setComment('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const parseResult = createReviewZodSchema.safeParse({
      appointmentId,
      rating,
      comment: comment.trim()
    })

    if (!parseResult.success) {
      const firstError =
        parseResult.error.issues[0]?.message || 'Please fill in all fields.'
      toast.error(firstError)
      return
    }

    try {
      const response = await mutateAsync({
        appointmentId,
        rating,
        comment: comment.trim()
      })
      if (response && 'success' in response && response.success === false) {
        toast.error(response.message || 'Failed to submit review.')
        return
      }

      toast.success('Thank you! Your review was submitted successfully.')
      onOpenChange(false)
      resetForm()
      await queryClient.invalidateQueries({ queryKey: ['my-reviews'] })
      await queryClient.invalidateQueries({ queryKey: ['reviews'] })
      router.refresh()
    } catch (error) {
      console.error('Error submitting review:', error)
      toast.error(
        error instanceof Error ? error.message : 'Failed to submit review.'
      )
    }
  }

  const activeRating = hoverRating !== null ? hoverRating : rating

  return (
    <AppModal
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val)
        if (!val) resetForm()
      }}
      size='md'
      title='Give Doctor Review'
      description='Share your healthcare consultation experience and doctor rating.'
      icon={<Star className='size-5 fill-amber-400 text-amber-400' />}
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
            <span>{isPending ? 'Submitting...' : 'Submit Review'}</span>
          </Button>
        </div>
      }>
      <form
        onSubmit={handleSubmit}
        className='space-y-4 pt-1'>
        {/* Appointment Select */}
        <div className='space-y-1.5'>
          <Label
            htmlFor='appointment-select'
            className='flex items-center gap-1.5 text-xs font-semibold text-foreground'>
            <Stethoscope className='size-3.5 text-primary' />
            Select Doctor Consultation
          </Label>

          <Select
            value={appointmentId}
            onValueChange={(val) => setAppointmentId(val || '')}
            disabled={isPending || isLoadingAppointments}>
            <SelectTrigger
              id='appointment-select'
              className='w-full'>
              <SelectValue
                placeholder={
                  isLoadingAppointments
                    ? 'Loading your appointments...'
                    : appointments.length === 0
                      ? 'No appointments found'
                      : 'Choose consultation to review'
                }
              />
            </SelectTrigger>
            <SelectContent>
              {appointments.map((app) => {
                const doctorName = app.doctor?.name || 'Doctor'
                const dateStr = app.schedule?.startDateTime
                  ? format(new Date(app.schedule.startDateTime), 'MMM dd, yyyy')
                  : 'Recent'
                return (
                  <SelectItem
                    key={app.id}
                    value={app.id}>
                    Dr. {doctorName} · {dateStr}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Interactive Star Rating */}
        <div className='rounded-xl border border-amber-200/60 bg-amber-50/40 p-4 dark:border-amber-900/40 dark:bg-amber-950/20 space-y-2'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300'>
              Your Rating
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
            htmlFor='review-comment'
            className='text-xs font-semibold text-foreground'>
            Feedback & Experience Comment
          </Label>
          <Textarea
            id='review-comment'
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={isPending}
            placeholder='Describe your doctor consultation experience, medical care, communication, and clinic service...'
            className='resize-none rounded-xl text-xs'
          />
        </div>
      </form>
    </AppModal>
  )
}

export default GiveReviewModal
