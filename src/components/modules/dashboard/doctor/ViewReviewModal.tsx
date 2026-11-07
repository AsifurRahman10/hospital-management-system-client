'use client'

import AppModal from '@/components/shared/AppModal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { IReview } from '@/types/review.type'
import { format } from 'date-fns'
import {
  Calendar,
  Clock,
  MessageSquare,
  Star,
  User
} from 'lucide-react'

interface ViewReviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  review: IReview | null
}

const formatDate = (dateStr?: string | Date) => {
  if (!dateStr) return 'N/A'
  try {
    const d = new Date(dateStr)
    return Number.isNaN(d.getTime()) ? 'N/A' : format(d, 'EEEE, MMM dd, yyyy')
  } catch {
    return 'N/A'
  }
}

const ViewReviewModal = ({
  open,
  onOpenChange,
  review
}: ViewReviewModalProps) => {
  if (!review) return null

  const patient = review.patient
  const appointment = review.appointment
  const schedule = appointment?.schedule

  const rating = Number(review.rating) || 0

  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      size='md'
      title='Patient Review Details'
      description='Feedback and rating submitted by your patient.'
      icon={<Star className='size-5 fill-amber-400 text-amber-400' />}
      footer={
        <div className='flex w-full justify-end'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      }>
      <div className='space-y-4 pt-1'>
        {/* Rating and Overview */}
        <div className='flex items-center justify-between rounded-xl border border-amber-200/60 bg-amber-50/50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20'>
          <div className='space-y-1'>
            <span className='text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-300'>
              Overall Rating
            </span>
            <div className='flex items-center gap-1.5'>
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`size-5 ${
                    index < Math.round(rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className='text-right'>
            <span className='text-3xl font-extrabold tabular-nums text-foreground'>
              {rating.toFixed(1)}
            </span>
            <span className='text-xs text-muted-foreground'> / 5.0</span>
          </div>
        </div>

        {/* Patient Details */}
        <div className='rounded-xl border border-border/70 bg-card p-4 space-y-3 shadow-2xs'>
          <p className='text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5'>
            <User className='size-3.5' /> Reviewer (Patient)
          </p>
          <div className='grid grid-cols-1 gap-2 text-xs sm:grid-cols-2'>
            <div>
              <span className='text-muted-foreground'>Full Name:</span>
              <p className='font-bold text-foreground text-sm'>
                {patient?.name || 'Anonymous Patient'}
              </p>
            </div>
            <div>
              <span className='text-muted-foreground'>Email Address:</span>
              <p className='font-medium text-foreground'>
                {patient?.email || 'N/A'}
              </p>
            </div>
            {patient?.contactNumber && (
              <div>
                <span className='text-muted-foreground'>Contact:</span>
                <p className='font-medium text-foreground'>
                  {patient.contactNumber}
                </p>
              </div>
            )}
            <div>
              <span className='text-muted-foreground'>Reviewed On:</span>
              <p className='font-medium text-foreground'>
                {formatDate(review.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Patient Comment */}
        <div className='rounded-xl border border-border/70 bg-card p-4 space-y-2 shadow-2xs'>
          <p className='text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5'>
            <MessageSquare className='size-3.5' /> Feedback & Comments
          </p>
          <div className='rounded-lg bg-muted/40 p-3'>
            <p className='text-sm leading-relaxed text-foreground italic'>
              {review.comment ? `"${review.comment}"` : 'No written feedback provided.'}
            </p>
          </div>
        </div>

        {/* Associated Appointment Details if present */}
        {(appointment || schedule) && (
          <div className='rounded-xl border border-border/70 bg-card p-4 space-y-2 shadow-2xs'>
            <p className='text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5'>
              <Calendar className='size-3.5' /> Consultation Info
            </p>
            <div className='grid grid-cols-1 gap-2 text-xs sm:grid-cols-2'>
              {schedule?.startDateTime && (
                <div>
                  <span className='text-muted-foreground'>Consultation Date:</span>
                  <p className='font-semibold text-foreground'>
                    {formatDate(schedule.startDateTime)}
                  </p>
                </div>
              )}
              {review.appointmentId && (
                <div>
                  <span className='text-muted-foreground'>Appointment ID:</span>
                  <p className='font-mono text-[11px] text-muted-foreground'>
                    {review.appointmentId}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AppModal>
  )
}

export default ViewReviewModal
