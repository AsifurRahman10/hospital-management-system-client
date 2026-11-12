'use client'

import AppModal from '@/components/shared/AppModal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { IDoctorDetails } from '@/types/doctor.types'
import { IProfile } from '@/types/profile.types'
import { IDoctorSchedule } from '@/types/schedule.types'
import { format } from 'date-fns'
import {
  CalendarCheck,
  CalendarDays,
  Clock,
  CreditCard,
  MapPin,
  User,
  Wallet
} from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { formatTime } from './useDoctorScheduleBooking'

interface DoctorScheduleBookingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  doctor: IDoctorDetails
  selectedSchedule: IDoctorSchedule | null
  currentUser?: IProfile
  isBooking: boolean
  onPayment: (method: 'PAY_NOW' | 'PAY_LATER') => Promise<void>
}

export const DoctorScheduleBookingModal = ({
  open,
  onOpenChange,
  doctor,
  selectedSchedule,
  currentUser,
  isBooking,
  onPayment
}: DoctorScheduleBookingModalProps) => {
  if (!selectedSchedule) return null

  const startDateTime = selectedSchedule.schedule?.startDateTime
  const endDateTime = selectedSchedule.schedule?.endDateTime
  const patientPhone =
    currentUser?.patient?.contactNumber || currentUser?.doctor?.contactNumber
  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      title='Confirm Appointment Booking'
      description='Review consultation details and choose your preferred payment option.'
      icon={<CalendarCheck className='size-5 text-primary' />}
      size='lg'
      footer={
        <div className='flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between'>
          <Button
            type='button'
            variant='outline'
            disabled={isBooking}
            onClick={() => onOpenChange(false)}
            className='h-10 rounded-xl border-border text-xs font-semibold'>
            Cancel
          </Button>

          <div className='flex justify-between md:justify-end gap-2'>
            <Button
              type='button'
              variant='secondary'
              disabled={isBooking}
              onClick={() => onPayment('PAY_LATER')}
              className='h-10 gap-1.5 rounded-xl border border-border/80 bg-muted/60 text-xs font-bold text-foreground hover:bg-muted'>
              <Wallet className='size-3.5 text-muted-foreground' />
              <span>Book now and Pay Later</span>
            </Button>

            <Button
              type='button'
              disabled={isBooking}
              onClick={() => onPayment('PAY_NOW')}
              className='h-10 gap-1.5 rounded-xl bg-primary text-xs font-bold text-white shadow-xs hover:bg-primary/90'>
              <CreditCard className='size-3.5' />
              <span>
                {isBooking
                  ? 'Processing...'
                  : `Pay Now (${
                      doctor.appointmentFee
                        ? `$${doctor.appointmentFee}`
                        : 'Free'
                    })`}
              </span>
            </Button>
          </div>
        </div>
      }>
      <div className='space-y-4 py-1 text-foreground'>
        {/* Doctor Info Card */}
        <div className='flex items-center gap-3.5 rounded-xl border border-border/70 bg-card p-3.5 shadow-2xs'>
          {doctor.profilePhoto ? (
            <div className='relative size-14 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-muted'>
              <Image
                src={doctor.profilePhoto}
                alt={doctor.name || 'Doctor'}
                fill
                className='object-cover'
              />
            </div>
          ) : (
            <div className='flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary'>
              <User className='size-7' />
            </div>
          )}
          <div className='min-w-0 flex-1'>
            <div className='flex items-center gap-1.5'>
              <h4 className='truncate text-sm font-bold text-foreground'>
                Dr. {doctor.name}
              </h4>
              <Badge
                variant='outline'
                className='shrink-0 border-primary/30 bg-primary/5 text-[10px] font-semibold text-primary'>
                Verified
              </Badge>
            </div>
            <p className='truncate text-xs text-muted-foreground'>
              {doctor.designation || 'Medical Specialist'}
              {doctor.doctorSpecialties && doctor.doctorSpecialties.length > 0
                ? ` · ${doctor.doctorSpecialties
                    .map((s) => s.specialty?.title)
                    .filter(Boolean)
                    .join(', ')}`
                : ''}
            </p>
            <div className='mt-1 flex items-center gap-1 text-[11px] text-muted-foreground'>
              <MapPin className='size-3 text-primary' />
              <span className='truncate'>
                {doctor.address || 'Life Hospital, Central Medical District'}
              </span>
            </div>
          </div>
        </div>

        {/* Schedule Details Grid */}
        <div className='grid grid-cols-1 gap-2.5 sm:grid-cols-2'>
          <div className='flex items-start gap-3 rounded-xl border border-border/70 bg-muted/20 p-3'>
            <div className='flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary'>
              <CalendarDays className='size-4' />
            </div>
            <div>
              <p className='text-[10px] font-bold uppercase tracking-wider text-muted-foreground'>
                Consultation Date
              </p>
              <p className='mt-0.5 text-xs font-bold text-foreground'>
                {startDateTime
                  ? format(new Date(startDateTime), 'EEEE, MMM dd, yyyy')
                  : 'N/A'}
              </p>
            </div>
          </div>

          <div className='flex items-start gap-3 rounded-xl border border-border/70 bg-muted/20 p-3'>
            <div className='flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary'>
              <Clock className='size-4' />
            </div>
            <div>
              <p className='text-[10px] font-bold uppercase tracking-wider text-muted-foreground'>
                Time Slot
              </p>
              <p className='mt-0.5 text-xs font-bold text-foreground'>
                {formatTime(startDateTime)}
                {endDateTime ? ` – ${formatTime(endDateTime)}` : ' (30 min)'}
              </p>
            </div>
          </div>
        </div>

        {/* Patient Info Card */}
        <div className='rounded-xl border border-border/70 bg-card p-3.5 space-y-2'>
          <p className='text-[11px] font-bold uppercase tracking-wider text-muted-foreground'>
            Patient Information
          </p>
          <div className='grid grid-cols-1 gap-2 sm:grid-cols-2 text-xs'>
            <div>
              <span className='text-muted-foreground'>Patient Name: </span>
              <span className='font-bold text-foreground'>
                {currentUser?.name || 'Registered Patient'}
              </span>
            </div>
            <div>
              <span className='text-muted-foreground'>Email: </span>
              <span className='font-medium text-foreground'>
                {currentUser?.email || 'N/A'}
              </span>
            </div>
            {patientPhone && (
              <div>
                <span className='text-muted-foreground'>Phone: </span>
                <span className='font-medium text-foreground'>
                  {patientPhone}
                </span>
              </div>
            )}
            <div>
              <span className='text-muted-foreground'>Type: </span>
              <span className='font-medium text-foreground'>
                In-Person Hospital Consultation
              </span>
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className='rounded-xl border border-primary/20 bg-primary/5 p-3.5 space-y-2'>
          <div className='flex items-center justify-between text-xs text-muted-foreground'>
            <span>Consultation Fee</span>
            <span className='font-semibold text-foreground'>
              {doctor.appointmentFee ? `$${doctor.appointmentFee}` : '$0.00'}
            </span>
          </div>
          <div className='flex items-center justify-between text-xs text-muted-foreground'>
            <span>Hospital Booking Fee</span>
            <span className='font-semibold text-emerald-600 dark:text-emerald-400'>
              Free (Included)
            </span>
          </div>
          <Separator className='my-1' />
          <div className='flex items-center justify-between text-sm font-bold text-foreground'>
            <span>Total Amount Due</span>
            <span className='text-base text-primary'>
              {doctor.appointmentFee ? `$${doctor.appointmentFee}` : 'Free'}
            </span>
          </div>
        </div>
      </div>
    </AppModal>
  )
}
