'use client'

import AppModal from '@/components/shared/AppModal'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/app/lib/utils'
import { Separator } from '@/components/ui/separator'
import { AppointmentStatus, IAppointment } from '@/types/appointment.type'
import { format } from 'date-fns'
import {
  Calendar,
  CalendarCheck,
  CheckCircle2,
  Clock,
  CreditCard,
  Mail,
  Phone,
  User,
  Video
} from 'lucide-react'

interface ViewAppointmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  appointment: IAppointment | null
  onOpenStatusDialog?: () => void
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

const formatTimeRange = (start?: string | Date, end?: string | Date) => {
  if (!start) return 'N/A'
  try {
    const s = new Date(start)
    const e = end ? new Date(end) : null
    const sStr = s.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
    if (e && !Number.isNaN(e.getTime())) {
      const eStr = e.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
      return `${sStr} — ${eStr}`
    }
    return sStr
  } catch {
    return 'N/A'
  }
}

const getStatusBadge = (status?: string) => {
  const normalized = status?.toUpperCase()
  switch (normalized) {
    case 'COMPLETED':
      return {
        label: 'Completed',
        variant: 'default' as const,
        className: 'bg-emerald-600 text-white'
      }
    case 'INPROGRESS':
      return {
        label: 'In Progress',
        variant: 'outline' as const,
        className: 'border-blue-400 text-blue-600 dark:text-blue-400'
      }
    case 'SCHEDULED':
      return {
        label: 'Scheduled',
        variant: 'secondary' as const,
        className: 'bg-primary/10 text-primary'
      }
    case 'CANCELED':
      return {
        label: 'Canceled',
        variant: 'destructive' as const,
        className: ''
      }
    default:
      return {
        label: status || 'Unknown',
        variant: 'secondary' as const,
        className: ''
      }
  }
}

const ViewAppointmentModal = ({
  open,
  onOpenChange,
  appointment,
  onOpenStatusDialog
}: ViewAppointmentModalProps) => {
  if (!appointment) return null

  const patient = appointment.patient
  const schedule =
    appointment.schedule || appointment.doctorSchedule?.schedule
  const statusMeta = getStatusBadge(appointment.status)
  const isPaid = String(appointment.paymentStatus || '').toUpperCase() === 'PAID'

  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      size='lg'
      title='Appointment Details'
      description='Review patient booking details, consultation time, and payment status.'
      icon={<CalendarCheck className='size-5 text-primary' />}
      footer={
        <div className='flex w-full items-center justify-between gap-3'>
          {appointment.videoCallingId ? (
            <a
              href={`/video-call/${appointment.videoCallingId}`}
              target='_blank'
              rel='noopener noreferrer'
              className={cn(
                buttonVariants({ variant: 'outline', size: 'sm' }),
                'gap-2'
              )}>
              <Video className='size-4 text-primary' /> Join Video Call
            </a>
          ) : (
            <div />
          )}

          <div className='flex items-center gap-2'>
            {onOpenStatusDialog && (
              <Button
                type='button'
                variant='outline'
                onClick={() => {
                  onOpenChange(false)
                  onOpenStatusDialog()
                }}>
                Change Status
              </Button>
            )}
            <Button
              type='button'
              onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      }>
      <div className='space-y-4 pt-1'>
        {/* Status & Payment Ribbon */}
        <div className='flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border/70 bg-muted/30 p-3 text-xs'>
          <div className='flex items-center gap-2'>
            <span className='font-semibold text-muted-foreground'>Status:</span>
            <Badge
              variant={statusMeta.variant}
              className={statusMeta.className}>
              {statusMeta.label}
            </Badge>
          </div>

          <div className='flex items-center gap-2'>
            <span className='font-semibold text-muted-foreground'>Payment:</span>
            <Badge
              variant={isPaid ? 'default' : 'destructive'}
              className={
                isPaid
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                  : ''
              }>
              <CreditCard className='mr-1 size-3' />
              {appointment.paymentStatus || 'UNPAID'}
            </Badge>
          </div>
        </div>

        {/* Patient Details */}
        <div className='rounded-xl border border-border/70 bg-card p-4 space-y-3 shadow-2xs'>
          <p className='text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5'>
            <User className='size-3.5' /> Patient Information
          </p>
          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs'>
            <div>
              <span className='text-muted-foreground'>Full Name:</span>
              <p className='font-bold text-foreground text-sm'>
                {patient?.name || 'Unnamed Patient'}
              </p>
            </div>
            <div>
              <span className='text-muted-foreground flex items-center gap-1'>
                <Mail className='size-3' /> Email:
              </span>
              <p className='font-medium text-foreground'>
                {patient?.email || 'N/A'}
              </p>
            </div>
            {patient?.contactNumber && (
              <div>
                <span className='text-muted-foreground flex items-center gap-1'>
                  <Phone className='size-3' /> Contact Number:
                </span>
                <p className='font-medium text-foreground'>
                  {patient.contactNumber}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Schedule & Timing */}
        <div className='rounded-xl border border-border/70 bg-card p-4 space-y-3 shadow-2xs'>
          <p className='text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5'>
            <Clock className='size-3.5' /> Scheduled Consultation Window
          </p>
          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs'>
            <div>
              <span className='text-muted-foreground flex items-center gap-1'>
                <Calendar className='size-3' /> Consultation Date:
              </span>
              <p className='font-bold text-foreground text-sm'>
                {formatDate(schedule?.startDateTime)}
              </p>
            </div>
            <div>
              <span className='text-muted-foreground flex items-center gap-1'>
                <Clock className='size-3' /> Time Slot:
              </span>
              <p className='font-bold text-foreground text-sm'>
                {formatTimeRange(
                  schedule?.startDateTime,
                  schedule?.endDateTime
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Video Calling Link */}
        {appointment.videoCallingId && (
          <div className='flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs'>
            <div className='flex items-center gap-2'>
              <Video className='size-4 text-primary' />
              <div>
                <p className='font-semibold text-foreground'>
                  Telemedicine Session
                </p>
                <p className='font-mono text-[11px] text-muted-foreground'>
                  Room ID: {appointment.videoCallingId}
                </p>
              </div>
            </div>
            <a
              href={`/video-call/${appointment.videoCallingId}`}
              target='_blank'
              rel='noopener noreferrer'
              className={cn(
                buttonVariants({ size: 'sm' }),
                'h-7 text-xs'
              )}>
              Launch Video Call
            </a>
          </div>
        )}
      </div>
    </AppModal>
  )
}

export default ViewAppointmentModal
