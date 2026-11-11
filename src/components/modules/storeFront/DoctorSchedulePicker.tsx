'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { IDoctorDetails } from '@/types/doctor.types'
import { cn } from '@/app/lib/utils'
import { addDays, format, isSameDay } from 'date-fns'
import { CalendarDays, CheckCircle2, Clock, RefreshCw } from 'lucide-react'
import React from 'react'
import {
  ScheduleLoginGate,
  SchedulePickerSkeleton,
  ScheduleRoleGate
} from './DoctorScheduleAuthGate'
import { DoctorScheduleBookingModal } from './DoctorScheduleBookingModal'
import {
  formatTime,
  getPeriod,
  getScheduleId,
  periodIcons,
  PeriodType,
  useDoctorScheduleBooking
} from './useDoctorScheduleBooking'

export interface DoctorSchedulePickerProps {
  doctor: IDoctorDetails
}

export const DoctorSchedulePicker = ({ doctor }: DoctorSchedulePickerProps) => {
  const {
    today,
    todayStart,
    currentUser,
    isAuthenticated,
    isPatient,
    isUserLoading,
    isSchedulesLoading,
    isSchedulesFetching,
    refetchSchedules,
    scheduleDates,
    selectedDate,
    handleSelectDate,
    selectedPeriod,
    setSelectedPeriod,
    selectedSchedule,
    setSelectedSchedule,
    displayedSchedules,
    availableSlotsCount,
    isBooking,
    isBookingModalOpen,
    setIsBookingModalOpen,
    handleConfirmBooking,
    handlePayment
  } = useDoctorScheduleBooking(doctor)

  // 1. Loading User State
  if (isUserLoading) {
    return <SchedulePickerSkeleton />
  }

  // 2. Not Logged In Gate
  if (!isAuthenticated) {
    return <ScheduleLoginGate doctor={doctor} />
  }

  // 3. Logged in as non-patient role (Doctor or Admin)
  if (!isPatient) {
    return <ScheduleRoleGate />
  }

  // 4. Authenticated Patient Schedule Picker
  return (
    <div className='rounded-2xl border border-border/80 bg-card p-6 shadow-xs sm:p-8 space-y-6'>
      {/* Header */}
      <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border/70 pb-4'>
        <div>
          <div className='flex items-center gap-2'>
            <CalendarDays className='size-5 text-primary' />
            <h2 className='text-lg font-extrabold tracking-tight text-foreground sm:text-xl'>
              Available Consultation Schedules
            </h2>
          </div>
          <p className='mt-1 text-xs text-muted-foreground'>
            Select your preferred consultation date and available time slot.
          </p>
        </div>

        <div className='flex items-center gap-2'>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => void refetchSchedules()}
            disabled={isSchedulesFetching}
            className='h-8 gap-1.5 rounded-lg border-border text-xs font-semibold text-muted-foreground hover:text-foreground'>
            <RefreshCw
              className={`size-3.5 ${
                isSchedulesFetching ? 'animate-spin text-primary' : ''
              }`}
            />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Date Presets */}
      <div className='flex flex-wrap items-center gap-1.5'>
        {[
          { label: 'Today', date: today },
          { label: 'Tomorrow', date: addDays(today, 1) },
          { label: 'Day 3', date: addDays(today, 2) },
          { label: 'Day 4', date: addDays(today, 3) }
        ].map((preset) => {
          const isSelected =
            selectedDate && isSameDay(selectedDate, preset.date)
          return (
            <button
              key={preset.label}
              type='button'
              onClick={() => handleSelectDate(preset.date)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-bold transition-all',
                isSelected
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
              )}>
              {preset.label}{' '}
              <span className='font-normal opacity-80'>
                ({format(preset.date, 'MMM d')})
              </span>
            </button>
          )
        })}
      </div>

      {/* Layout: Calendar on left + Time Slots on right */}
      <div className='grid gap-6 md:grid-cols-[280px_1fr]'>
        {/* Left: Interactive Calendar */}
        <div className='rounded-xl border border-border/70 bg-[#f8fafc] p-3 shadow-2xs space-y-3'>
          <p className='text-xs font-bold uppercase tracking-wider text-muted-foreground'>
            Select Date
          </p>

          <Calendar
            mode='single'
            selected={selectedDate}
            onSelect={(d) => {
              if (d) handleSelectDate(d)
            }}
            disabled={{ before: todayStart }}
            modifiers={{
              hasSchedule: scheduleDates
            }}
            modifiersClassNames={{
              hasSchedule:
                'relative font-bold text-primary after:absolute after:bottom-1 after:left-1/2 after:size-1 after:-translate-x-1/2 after:rounded-full after:bg-primary'
            }}
            className='w-full p-0'
          />

          <Separator />

          <div className='flex items-center gap-2 px-1 text-[11px] text-muted-foreground'>
            <span className='size-2 rounded-full bg-primary' />
            <span>Dates with active doctor schedules</span>
          </div>
        </div>

        {/* Right: Slot selection for chosen date */}
        <div className='flex flex-col space-y-4'>
          {/* Day overview & Period Filters */}
          <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-3'>
            <div>
              <p className='text-sm font-bold text-foreground'>
                {selectedDate
                  ? format(selectedDate, 'EEEE, MMMM dd, yyyy')
                  : 'Select a Date'}
              </p>
              <p className='text-xs text-muted-foreground'>
                {availableSlotsCount} open slot
                {availableSlotsCount === 1 ? '' : 's'} available
              </p>
            </div>

            {/* Period Filter Tabs */}
            <div className='flex items-center gap-1 rounded-lg border border-border/70 bg-card p-0.5 text-xs font-semibold'>
              {(['All', 'Morning', 'Afternoon', 'Evening'] as PeriodType[]).map(
                (period) => (
                  <button
                    key={period}
                    type='button'
                    onClick={() => setSelectedPeriod(period)}
                    className={cn(
                      'rounded-md px-2.5 py-1 text-xs transition-all',
                      selectedPeriod === period
                        ? 'bg-primary text-white font-bold shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                    )}>
                    {period}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Time Slots Grid */}
          {isSchedulesLoading ? (
            <div className='grid grid-cols-2 gap-2 sm:grid-cols-3'>
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className='h-14 rounded-xl'
                />
              ))}
            </div>
          ) : displayedSchedules.length > 0 ? (
            <div className='grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3'>
              {displayedSchedules.map((item, idx) => {
                const isBooked = item.isBooked
                const itemId = getScheduleId(item)
                const selectedId = getScheduleId(selectedSchedule)
                const isSelected = Boolean(
                  selectedId && itemId && selectedId === itemId
                )
                const startStr = item.schedule?.startDateTime
                const endStr = item.schedule?.endDateTime
                const period = startStr ? getPeriod(startStr) : 'Morning'
                const PeriodIcon = periodIcons[period]

                return (
                  <button
                    key={itemId || idx}
                    type='button'
                    disabled={isBooked}
                    onClick={() =>
                      setSelectedSchedule(isSelected ? null : item)
                    }
                    className={cn(
                      'group relative flex flex-col justify-between rounded-xl border p-3 text-left transition-all',
                      isBooked
                        ? 'cursor-not-allowed border-border/40 bg-muted/30 text-muted-foreground/60 opacity-60'
                        : isSelected
                          ? 'border-primary bg-primary/10 shadow-xs'
                          : 'border-border/70 bg-card hover:border-primary/50 hover:bg-primary/5'
                    )}>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-1.5 text-xs font-bold text-foreground'>
                        <Clock className='size-3.5 text-primary' />
                        <span>{formatTime(startStr)}</span>
                      </div>
                      <PeriodIcon className='size-3.5 text-muted-foreground' />
                    </div>

                    <div className='mt-2 flex items-center justify-between text-[11px]'>
                      <span className='text-muted-foreground'>
                        {endStr ? `to ${formatTime(endStr)}` : '30 min'}
                      </span>
                      <span
                        className={cn(
                          'rounded-md px-1.5 py-0.5 font-bold',
                          isBooked
                            ? 'bg-muted text-muted-foreground'
                            : isSelected
                              ? 'bg-primary text-white'
                              : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300'
                        )}>
                        {isBooked
                          ? 'Booked'
                          : isSelected
                            ? 'Selected'
                            : 'Available'}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/20 p-8 text-center'>
              <Clock className='size-8 text-muted-foreground' />
              <p className='mt-2 text-sm font-bold text-foreground'>
                No slots available on this date
              </p>
              <p className='mt-1 max-w-xs text-xs text-muted-foreground'>
                Try selecting a highlighted date from the calendar or choose
                another time period.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Selected Slot Confirmation Bar */}
      {selectedSchedule && (
        <div className='flex flex-col gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className='space-y-0.5'>
            <div className='flex items-center gap-2'>
              <Badge
                variant='default'
                className='h-5 bg-primary px-2 text-[10px] font-bold'>
                Slot Selected
              </Badge>
              <span className='text-xs font-bold text-foreground'>
                {selectedSchedule.schedule?.startDateTime &&
                  format(
                    new Date(selectedSchedule.schedule.startDateTime),
                    'EEE, MMM dd, yyyy'
                  )}{' '}
                · {formatTime(selectedSchedule.schedule?.startDateTime)}
              </span>
            </div>
            <p className='text-xs text-muted-foreground'>
              Consultation Fee:{' '}
              <span className='font-extrabold text-foreground'>
                {doctor.appointmentFee
                  ? `$${doctor.appointmentFee}`
                  : 'Inquire'}
              </span>
            </p>
          </div>

          <div className='flex items-center gap-2'>
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={() => setSelectedSchedule(null)}
              className='h-9 rounded-xl border-border text-xs font-semibold'>
              Cancel
            </Button>
            <Button
              type='button'
              size='sm'
              disabled={isBooking}
              onClick={handleConfirmBooking}
              className='h-9 gap-1.5 rounded-xl bg-primary px-4 text-xs font-bold text-white shadow-xs hover:bg-primary/90'>
              <CheckCircle2 className='size-3.5' />
              <span>{isBooking ? 'Reserving...' : 'Book Appointment'}</span>
            </Button>
          </div>
        </div>
      )}

      {/* Booking Confirmation & Payment Modal */}
      <DoctorScheduleBookingModal
        open={isBookingModalOpen}
        onOpenChange={setIsBookingModalOpen}
        doctor={doctor}
        selectedSchedule={selectedSchedule}
        currentUser={currentUser}
        isBooking={isBooking}
        onPayment={handlePayment}
      />
    </div>
  )
}

export default DoctorSchedulePicker
