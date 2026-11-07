'use client'

import AppModal from '@/components/shared/AppModal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { IPrescription } from '@/types/prescription.type'
import { format } from 'date-fns'
import {
  Calendar,
  CalendarCheck,
  Clock,
  Download,
  FileText,
  User
} from 'lucide-react'

interface ViewPrescriptionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  prescription: IPrescription | null
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

const ViewPrescriptionModal = ({
  open,
  onOpenChange,
  prescription
}: ViewPrescriptionModalProps) => {
  if (!prescription) return null

  const patient = prescription.patient
  const appointment = prescription.appointment

  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      size='lg'
      title='Prescription Details'
      description='Review medical instructions and follow-up consultation schedule.'
      icon={<FileText className='size-5 text-primary' />}
      footer={
        <div className='flex w-full items-center justify-between gap-3'>
          {prescription.pdfUrl ? (
            <a
              href={prescription.pdfUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex h-8 items-center gap-1.5 rounded-md border border-input bg-background px-3 text-xs font-medium hover:bg-accent hover:text-accent-foreground'>
              <Download className='size-3.5' /> Download PDF
            </a>
          ) : (
            <div />
          )}
          <Button
            type='button'
            variant='default'
            onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      }>
      <div className='space-y-4 pt-1'>
        {/* Patient & Doctor Summary Card */}
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
          <div className='rounded-xl border border-border/70 bg-muted/30 p-3.5 space-y-2'>
            <div className='flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
              <User className='size-3.5 text-primary' /> Patient Information
            </div>
            <div>
              <p className='text-sm font-bold text-foreground'>
                {patient?.name || 'N/A'}
              </p>
              <p className='text-xs text-muted-foreground'>
                {patient?.email || 'N/A'}
              </p>
              {patient?.contactNumber && (
                <p className='text-xs text-muted-foreground'>
                  Phone: {patient.contactNumber}
                </p>
              )}
            </div>
          </div>

          <div className='rounded-xl border border-border/70 bg-muted/30 p-3.5 space-y-2'>
            <div className='flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
              <Calendar className='size-3.5 text-primary' /> Key Dates
            </div>
            <div className='space-y-1 text-xs'>
              <div>
                <span className='font-medium text-muted-foreground'>
                  Issued Date:{' '}
                </span>
                <span className='font-semibold text-foreground'>
                  {formatDate(prescription.createdAt)}
                </span>
              </div>
              <div>
                <span className='font-medium text-muted-foreground'>
                  Follow-up Date:{' '}
                </span>
                <Badge
                  variant='secondary'
                  className='ml-1 font-semibold text-primary'>
                  <CalendarCheck className='mr-1 size-3' />
                  {formatDate(prescription.followUpDate)}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Appointment ID Tag */}
        <div className='flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/60 bg-card px-3 py-2 text-xs text-muted-foreground'>
          <div className='flex items-center gap-1.5'>
            <Clock className='size-3.5 text-muted-foreground' />
            <span>Appointment ID:</span>
            <span className='font-mono font-medium text-foreground'>
              {prescription.appointmentId}
            </span>
          </div>
          {appointment?.paymentStatus && (
            <Badge
              variant='outline'
              className='bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'>
              Payment: {appointment.paymentStatus}
            </Badge>
          )}
        </div>

        <Separator />

        {/* Medical Instructions */}
        <div className='space-y-1.5'>
          <p className='text-xs font-bold uppercase tracking-wider text-foreground'>
            Doctor Instructions & Prescription
          </p>
          <div className='rounded-xl border border-border/70 bg-card p-4 shadow-2xs'>
            <p className='whitespace-pre-wrap text-sm leading-relaxed text-foreground'>
              {prescription.instructions}
            </p>
          </div>
        </div>
      </div>
    </AppModal>
  )
}

export default ViewPrescriptionModal
