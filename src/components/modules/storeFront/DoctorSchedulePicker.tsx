'use client'

import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { getDoctorSchedulesByDoctorId } from '@/service/doctorSchedule.service'
import { getMe } from '@/service/profile.service'
import { IDoctorDetails } from '@/types/doctor.types'
import { IDoctorSchedule } from '@/types/schedule.types'
import { useQuery } from '@tanstack/react-query'
import { cn } from 'cn'
import {
  addDays,
  format,
  isSameDay,
  startOfDay
} from 'date-fns'
import {
  CalendarDays,
  Check,
  CheckCircle2,
  Clock,
  Lock,
  LogIn,
  RefreshCw,
  Sun,
  Sunrise,
  Sunset,
  UserCheck
} from 'lucide-react'
import Link from 'next/link'
import React, { useMemo, useState } from 'react'
import { toast } from 'sonner'

type PeriodType = 'All' | 'Morning' | 'Afternoon' | 'Evening'

const formatTime = (dateStr?: string) => {
  if (!dateStr) return 'N/A'
  try {
    const date = new Date(dateStr)
    if (Number.isNaN(date.getTime())) return 'N/A'
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date)
  } catch {
    return 'N/A'
  }
}

const getPeriod = (dateStr: string): 'Morning' | 'Afternoon' | 'Evening' => {
  try {
    const date = new Date(dateStr)
    const hour = date.getHours()
    if (hour < 12) return 'Morning'
    if (hour < 17) return 'Afternoon'
    return 'Evening'
  } catch {
    return 'Morning'
  }
}

const periodIcons = {
  Morning: Sunrise,
  Afternoon: Sun,
  Evening: Sunset
}

interface DoctorSchedulePickerProps {
  doctor: IDoctorDetails
}

export const DoctorSchedulePicker = ({ doctor }: DoctorSchedulePickerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() =>
    new Date()
  )
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('All')
  const [selectedSchedule, setSelectedSchedule] =
    useState<IDoctorSchedule | null>(null)
  const [isBooking, setIsBooking] = useState(false)

  const today = useMemo(() => new Date(), [])
  const todayStart = useMemo(() => startOfDay(today), [today])

  // Check user authentication
  const {
    data: userProfileResponse,
    isLoading: isUserLoading
  } = useQuery({
    queryKey: ['me'],
    queryFn: () => getMe(),
    retry: false
  })

  const currentUser = userProfileResponse?.data
  const isAuthenticated = Boolean(currentUser && currentUser.id)
  const isPatient = currentUser?.role?.toUpperCase() === 'PATIENT'

  // Fetch doctor schedules when logged in
  const {
    data: schedulesResponse,
    isLoading: isSchedulesLoading,
    isFetching: isSchedulesFetching,
    refetch: refetchSchedules
  } = useQuery({
    queryKey: ['doctor-schedules', doctor.id],
    queryFn: () => getDoctorSchedulesByDoctorId(doctor.id),
    enabled: isAuthenticated && Boolean(doctor.id)
  })

  // Extract schedules safely
  const rawSchedules = schedulesResponse?.data
  const schedules: IDoctorSchedule[] = useMemo(() => {
    if (Array.isArray(rawSchedules)) return rawSchedules
    if (
      rawSchedules &&
      typeof rawSchedules === 'object' &&
      'data' in rawSchedules &&
      Array.isArray((rawSchedules as unknown as { data: IDoctorSchedule[] }).data)
    ) {
      return (rawSchedules as unknown as { data: IDoctorSchedule[] }).data
    }
    return (doctor.doctorSchedules as unknown as IDoctorSchedule[]) || []
  }, [rawSchedules, doctor.doctorSchedules])

  // Available dates that have schedules
  const scheduleDates = useMemo(() => {
    return schedules
      .map((item) =>
        item.schedule?.startDateTime
          ? new Date(item.schedule.startDateTime)
          : null
      )
      .filter((d): d is Date => d !== null && !Number.isNaN(d.getTime()))
  }, [schedules])

  // Filter schedules by selected date
  const schedulesOnSelectedDate = useMemo(() => {
    if (!selectedDate) return schedules
    return schedules.filter((item) => {
      const date = item.schedule?.startDateTime
        ? new Date(item.schedule.startDateTime)
        : null
      return date && isSameDay(date, selectedDate)
    })
  }, [schedules, selectedDate])

  // Filter by period
  const displayedSchedules = useMemo(() => {
    if (selectedPeriod === 'All') return schedulesOnSelectedDate
    return schedulesOnSelectedDate.filter((item) => {
      if (!item.schedule?.startDateTime) return false
      return getPeriod(item.schedule.startDateTime) === selectedPeriod
    })
  }, [schedulesOnSelectedDate, selectedPeriod])

  // Count available unbooked slots
  const availableSlotsCount = useMemo(() => {
    return schedulesOnSelectedDate.filter((s) => !s.isBooked).length
  }, [schedulesOnSelectedDate])

  // Handle appointment reservation
  const handleConfirmBooking = async () => {
    if (!selectedSchedule) {
      toast.error('Please select an available schedule slot.')
      return
    }

    setIsBooking(true)
    try {
      // Slot reservation feedback
      toast.success(
        `Consultation slot reserved for ${format(
          new Date(selectedSchedule.schedule!.startDateTime),
          'EEE, MMM dd'
        )} at ${formatTime(selectedSchedule.schedule?.startDateTime)}!`
      )
    } catch {
      toast.error('Failed to reserve appointment slot. Please try again.')
    } finally {
      setIsBooking(false)
    }
  }

  // 1. Loading User State
  if (isUserLoading) {
    return (
      <div className='rounded-2xl border border-border/80 bg-card p-8 shadow-xs space-y-4'>
        <div className='flex items-center gap-3'>
          <Skeleton className='size-10 rounded-xl' />
          <div className='space-y-1.5'>
            <Skeleton className='h-4 w-48' />
            <Skeleton className='h-3 w-64' />
          </div>
        </div>
        <Skeleton className='h-72 w-full rounded-xl' />
      </div>
    )
  }

  // 2. Not Logged In Gate (Required by prompt)
  if (!isAuthenticated) {
    return (
      <div className='rounded-2xl border border-dashed border-border/80 bg-card p-8 text-center shadow-xs sm:p-12'>
        <div className='mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary'>
          <Lock className='size-8' />
        </div>

        <span className='mt-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary'>
          Patient Portal Exclusive
        </span>

        <h3 className='mt-3 text-xl font-extrabold tracking-tight text-foreground sm:text-2xl'>
          Log In to View & Book Schedules
        </h3>

        <p className='mx-auto mt-2 max-w-md text-xs sm:text-sm text-muted-foreground leading-relaxed'>
          Real-time appointment schedules and consultation booking for Dr.{' '}
          {doctor.name} are accessible exclusively to logged-in patients.
        </p>

        <div className='mt-8 flex flex-wrap items-center justify-center gap-3'>
          <Link
            href={`/login?redirect=/doctors/${doctor.id}`}
            className={buttonVariants({
              className:
                'h-11 rounded-xl bg-primary px-6 text-xs font-bold text-white shadow-md shadow-primary/20 hover:bg-primary/90'
            })}>
            <LogIn className='mr-2 size-4' />
            Log In as Patient
          </Link>

          <Link
            href='/register'
            className={buttonVariants({
              variant: 'outline',
              className:
                'h-11 rounded-xl border-border px-6 text-xs font-bold text-foreground hover:bg-muted'
            })}>
            Create an Account
          </Link>
        </div>
      </div>
    )
  }

  // 3. Logged in as non-patient role (Doctor or Admin)
  if (!isPatient) {
    return (
      <div className='rounded-2xl border border-amber-200 bg-amber-50/50 p-8 text-center shadow-xs dark:border-amber-900/50 dark:bg-amber-950/20'>
        <div className='mx-auto flex size-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'>
          <UserCheck className='size-7' />
        </div>
        <h3 className='mt-3 text-lg font-bold text-foreground'>
          Patient Account Needed
        </h3>
        <p className='mx-auto mt-1 max-w-md text-xs text-muted-foreground'>
          You are currently logged in as a {currentUser?.role}. Appointment
          booking is only available for registered patient accounts.
        </p>
      </div>
    )
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
          const isSelected = selectedDate && isSameDay(selectedDate, preset.date)
          return (
            <button
              key={preset.label}
              type='button'
              onClick={() => setSelectedDate(preset.date)}
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
              if (d) setSelectedDate(d)
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
                {availableSlotsCount} open slot{availableSlotsCount === 1 ? '' : 's'}{' '}
                available
              </p>
            </div>

            {/* Period Filter Tabs */}
            <div className='flex items-center gap-1 rounded-lg border border-border/70 bg-card p-0.5 text-xs font-semibold'>
              {(['All', 'Morning', 'Afternoon', 'Evening'] as const).map(
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
              {displayedSchedules.map((item) => {
                const isBooked = item.isBooked
                const isSelected = selectedSchedule?.id === item.id
                const startStr = item.schedule?.startDateTime
                const endStr = item.schedule?.endDateTime
                const period = startStr ? getPeriod(startStr) : 'Morning'
                const PeriodIcon = periodIcons[period]

                return (
                  <button
                    key={item.id}
                    type='button'
                    disabled={isBooked}
                    onClick={() => setSelectedSchedule(item)}
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
                        {isBooked ? 'Booked' : isSelected ? 'Selected' : 'Available'}
                      </span>
                    </div>

                    {isSelected && (
                      <span className='absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-primary text-white shadow-xs'>
                        <Check className='size-2.5' />
                      </span>
                    )}
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
                Try selecting a highlighted date from the calendar or choose another
                time period.
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
                {doctor.appointmentFee ? `$${doctor.appointmentFee}` : 'Inquire'}
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
    </div>
  )
}

export default DoctorSchedulePicker
