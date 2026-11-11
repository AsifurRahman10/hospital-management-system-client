'use client'

import {
  bookAppointmentNow,
  bookNowPayLater
} from '@/service/appointment.service'
import { getDoctorSchedulesByDoctorId } from '@/service/doctorSchedule.service'
import { getMe } from '@/service/profile.service'
import { IDoctorDetails } from '@/types/doctor.types'
import { IDoctorSchedule } from '@/types/schedule.types'
import { useQuery } from '@tanstack/react-query'
import { isSameDay, startOfDay } from 'date-fns'
import { LucideIcon, Sun, Sunrise, Sunset } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

export type PeriodType = 'All' | 'Morning' | 'Afternoon' | 'Evening'

export const formatTime = (dateStr?: string) => {
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

export const getPeriod = (
  dateStr: string
): 'Morning' | 'Afternoon' | 'Evening' => {
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

export const periodIcons: Record<
  'Morning' | 'Afternoon' | 'Evening',
  LucideIcon
> = {
  Morning: Sunrise,
  Afternoon: Sun,
  Evening: Sunset
}

export const getScheduleId = (item?: IDoctorSchedule | null): string => {
  if (!item) return ''
  return item.id || item.scheduleId || item.schedule?.id || ''
}

export function useDoctorScheduleBooking(doctor: IDoctorDetails) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    () => new Date()
  )
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('All')
  const [selectedSchedule, setSelectedSchedule] =
    useState<IDoctorSchedule | null>(null)
  const [isBooking, setIsBooking] = useState(false)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

  const today = useMemo(() => new Date(), [])
  const todayStart = useMemo(() => startOfDay(today), [today])

  // Check user authentication
  const { data: userProfileResponse, isLoading: isUserLoading } = useQuery({
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
      Array.isArray(
        (rawSchedules as unknown as { data: IDoctorSchedule[] }).data
      )
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

  // Select a new date & clear slot selection
  const handleSelectDate = (date?: Date) => {
    setSelectedDate(date)
    setSelectedSchedule(null)
  }

  // Handle opening booking confirmation modal
  const handleConfirmBooking = () => {
    if (!selectedSchedule) {
      toast.error('Please select an available schedule slot.')
      return
    }

    if (!selectedSchedule.schedule?.startDateTime) {
      toast.error('Selected slot does not contain valid appointment timing.')
      return
    }

    setIsBookingModalOpen(true)
  }

  // Handle appointment reservation with Pay Now or Pay Later
  const handlePayment = async (paymentMethod: 'PAY_NOW' | 'PAY_LATER') => {
    if (!selectedSchedule) return

    setIsBooking(true)
    try {
      if (paymentMethod === 'PAY_NOW') {
        const response = await bookAppointmentNow(
          selectedSchedule.doctorId,
          selectedSchedule.scheduleId
        )
        const paymentUrl = response.data?.paymentUrl
        if (paymentUrl) {
          window.location.href = paymentUrl
        }
        toast.success(
          `Appointment confirmed! Redirecting to secure payment checkout...`
        )
      } else {
        const response = await bookNowPayLater(
          selectedSchedule.doctorId,
          selectedSchedule.scheduleId
        )
        if (response.data) {
          toast.success(
            `Appointment confirmed with Pay Later! You can pay at the clinic counter.`
          )
        }
      }

      setIsBookingModalOpen(false)
      setSelectedSchedule(null)
      void refetchSchedules()
    } catch {
      toast.error('Failed to complete appointment booking. Please try again.')
    } finally {
      setIsBooking(false)
    }
  }

  return {
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
  }
}
