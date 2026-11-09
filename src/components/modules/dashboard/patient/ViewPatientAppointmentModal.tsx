'use client'

import AppModal from '@/components/shared/AppModal'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { AppointmentStatus, IAppointment } from '@/types/appointment.type'
import { cn } from 'cn'
import { format } from 'date-fns'
import {
  Ban,
  Building,
  Calendar,
  CalendarCheck,
  Clock,
  CreditCard,
  Phone,
  Stethoscope,
  Video
} from 'lucide-react'

interface ViewPatientAppointmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  appointment: IAppointment | null
  onOpenCancelDialog?: (appointment: IAppointment) => void
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

const ViewPatientAppointmentModal = ({
  open,
  onOpenChange,
  appointment,
  onOpenCancelDialog
}: ViewPatientAppointmentModalProps) => {
  if (!appointment) return null
  const active = appointment

  const doctor = active.doctor
  const schedule =
    active.schedule || active.doctorSchedule?.schedule
  const statusMeta = getStatusBadge(active.status)
  const isPaid = active.paymentStatus?.toUpperCase() === 'PAID'
  const isScheduled = active.status === AppointmentStatus.SCHEDULED

  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      size='lg'
      title='Appointment Details'
      description='Review your consultation time, attending physician, and status.'
      icon={<CalendarCheck className='size-5 text-primary' />}
      footer={
        <div className='flex w-full items-center justify-between gap-3'>
          {isScheduled && onOpenCancelDialog ? (
            <Button
              variant='destructive'
              size='sm'
              className='gap-1.5 text-xs'
              onClick={() => {
                onOpenChange(false)
                onOpenCancelDialog(active)
              }}>
              <Ban className='size-3.5' /> Cancel Appointment
            </Button>
          ) : (
            <div />
          )}

          <div className='flex items-center gap-2'>
            {active.videoCallingId && (
              <a
                href={`/video-call/${active.videoCallingId}`}
                target='_blank'
                rel='noopener noreferrer'
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'sm' }),
                  'gap-1.5 text-xs'
                )}>
                <Video className='size-3.5 text-primary' /> Video Room
              </a>
            )}
            <Button
              variant='outline'
              size='sm'
              onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      }>
      <div className='space-y-4 pt-1'>
        {/* Status and Overview Strip */}
        <div className='flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 bg-muted/30 p-3.5'>
          <div className='flex items-center gap-2'>
            <span className='text-xs font-semibold text-muted-foreground'>
              Status:
            </span>
            <Badge
              variant={statusMeta.variant}
              className={statusMeta.className}>
              {statusMeta.label}
            </Badge>
          </div>

          <div className='flex items-center gap-2'>
            <span className='text-xs font-semibold text-muted-foreground'>
              Payment:
            </span>
            <Badge
              variant={isPaid ? 'default' : 'destructive'}
              className={
                isPaid
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                  : ''
              }>
              <CreditCard className='mr-1 size-3' />
              {active.paymentStatus || 'UNPAID'}
            </Badge>
          </div>

          <div className='text-xs text-muted-foreground'>
            ID: <span className='font-mono font-medium'>{active.id.slice(0, 8)}</span>
          </div>
        </div>

        {/* Doctor Information Card */}
        <div className='rounded-xl border border-border/70 bg-card p-4 space-y-3 shadow-2xs'>
          <p className='text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5'>
            <Stethoscope className='size-3.5' /> Attending Doctor
          </p>
          <div className='grid grid-cols-1 gap-2 text-xs sm:grid-cols-2'>
            <div>
              <span className='text-muted-foreground'>Doctor Name:</span>
              <p className='font-bold text-foreground text-sm'>
                Dr. {doctor?.name || 'Assigned Doctor'}
              </p>
            </div>
            <div>
              <span className='text-muted-foreground'>Email Address:</span>
              <p className='font-medium text-foreground'>
                {doctor?.email || 'N/A'}
              </p>
            </div>
            {doctor?.designation && (
              <div>
                <span className='text-muted-foreground'>Designation:</span>
                <p className='font-medium text-foreground'>
                  {doctor.designation}
                </p>
              </div>
            )}
            {doctor?.qualifications && (
              <div>
                <span className='text-muted-foreground'>Qualifications:</span>
                <p className='font-medium text-foreground'>
                  {doctor.qualifications}
                </p>
              </div>
            )}
            {doctor?.currentWorkplace && (
              <div className='sm:col-span-2'>
                <span className='text-muted-foreground flex items-center gap-1'>
                  <Building className='size-3' /> Workplace / Clinic:
                </span>
                <p className='font-medium text-foreground'>
                  {doctor.currentWorkplace}
                </p>
              </div>
            )}
            {doctor?.contactNumber && (
              <div>
                <span className='text-muted-foreground flex items-center gap-1'>
                  <Phone className='size-3' /> Contact:
                </span>
                <p className='font-medium text-foreground'>
                  {doctor.contactNumber}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Schedule & Timing */}
        <div className='rounded-xl border border-border/70 bg-card p-4 space-y-3 shadow-2xs'>
          <p className='text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5'>
            <Clock className='size-3.5' /> Consultation Schedule
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
        {active.videoCallingId && (
          <div className='flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs'>
            <div className='flex items-center gap-2'>
              <Video className='size-4 text-primary' />
              <div>
                <p className='font-semibold text-foreground'>
                  Telemedicine Session
                </p>
                <p className='font-mono text-[11px] text-muted-foreground'>
                  Room ID: {active.videoCallingId}
                </p>
              </div>
            </div>
            <a
              href={`/video-call/${active.videoCallingId}`}
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

export default ViewPatientAppointmentModal
