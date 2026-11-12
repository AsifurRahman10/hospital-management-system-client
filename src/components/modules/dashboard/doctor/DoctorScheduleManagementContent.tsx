'use client'

import { useMemo, useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import {
  format,
  isSameDay,
  parseISO,
  startOfDay,
  endOfDay,
  addDays
} from 'date-fns'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { DateRange } from 'react-day-picker'

import { getSchedules } from '@/service/schedule.service'
import { ISchedule } from '@/types/schedule.types'

import { Calendar } from '@/components/ui/calendar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

import {
  CalendarDays,
  Clock,
  Sun,
  Sunrise,
  Sunset,
  CalendarCheck,
  RefreshCw,
  Calendar as CalendarIcon
} from 'lucide-react'

type PeriodType = 'Morning' | 'Afternoon' | 'Evening'

const formatTime = (dateStr: string) => {
  try {
    const date = new Date(dateStr)
    if (Number.isNaN(date.getTime())) return 'N/A'
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date)
  } catch {
    return 'N/A'
  }
}

const format24hTime = (dateStr: string) => {
  try {
    const date = new Date(dateStr)
    if (Number.isNaN(date.getTime())) return 'N/A'
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date)
  } catch {
    return 'N/A'
  }
}

const getPeriod = (dateStr: string): PeriodType => {
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

const periodConfig = {
  Morning: {
    icon: Sunrise,
    color: 'text-amber-500',
    badgeClass:
      'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
  },
  Afternoon: {
    icon: Sun,
    color: 'text-orange-500',
    badgeClass:
      'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800'
  },
  Evening: {
    icon: Sunset,
    color: 'text-indigo-500',
    badgeClass:
      'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800'
  }
}

interface DoctorScheduleManagementContentProps {
  queryStringFromUrl?: string
}

const DoctorScheduleManagementContent = ({
  queryStringFromUrl = ''
}: DoctorScheduleManagementContentProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentQueryString = searchParams.toString() || queryStringFromUrl
  const scheduleQueryString = useMemo(() => {
    const params = new URLSearchParams(currentQueryString)
    params.set('sortBy', 'startDateTime')
    params.set('sortOrder', 'asc')
    return params.toString()
  }, [currentQueryString])

  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: ['schedules', scheduleQueryString] as const,
    queryFn: ({ queryKey: [, query] }) => getSchedules(query),
    placeholderData: keepPreviousData
  })

  // Safely extract schedules array
  const schedules: ISchedule[] = useMemo(() => {
    if (!data) return []
    const raw = data.data
    if (Array.isArray(raw)) return raw
    if (
      raw &&
      typeof raw === 'object' &&
      'data' in raw &&
      Array.isArray((raw as unknown as { data: ISchedule[] }).data)
    ) {
      return (raw as unknown as { data: ISchedule[] }).data
    }
    if (Array.isArray(data)) return data as unknown as ISchedule[]
    return []
  }, [data])

  // Calendar selection mode: 'single' | 'range'
  const [calendarMode, setCalendarMode] = useState<'single' | 'range'>('single')
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType | 'All'>(
    'All'
  )

  // Parse current date filters from URL (supports startDateTime[gte] and endDateTime[lte])
  const startFromUrl =
    searchParams.get('startDateTime[gte]') || searchParams.get('startDateTime')
  const endFromUrl =
    searchParams.get('endDateTime[lte]') || searchParams.get('endDateTime')

  const parsedFromDate = useMemo(
    () => (startFromUrl ? parseISO(startFromUrl) : undefined),
    [startFromUrl]
  )
  const parsedToDate = useMemo(
    () => (endFromUrl ? parseISO(endFromUrl) : undefined),
    [endFromUrl]
  )

  // Local selection states
  const [singleDate, setSingleDate] = useState<Date | undefined>(
    parsedFromDate ?? new Date()
  )
  const [rangeDate, setRangeDate] = useState<DateRange | undefined>({
    from: parsedFromDate,
    to: parsedToDate
  })

  // Dates with schedules for calendar dots
  const scheduleDates = useMemo(
    () => schedules.map((schedule) => new Date(schedule.startDateTime)),
    [schedules]
  )

  // Disable past dates (only today and future dates are selectable)
  const todayStart = useMemo(() => startOfDay(new Date()), [])

  // Sync selected date with URL query params
  const updateUrlParams = (from?: Date, to?: Date) => {
    const params = new URLSearchParams(searchParams.toString())

    params.delete('startDateTime')
    params.delete('endDateTime')
    params.delete('startDateTime[gte]')
    params.delete('endDateTime[lte]')

    if (from) {
      const start = startOfDay(from)
      const end = endOfDay(to || from)
      params.set('startDateTime[gte]', start.toISOString())
      params.set('endDateTime[lte]', end.toISOString())
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  // Handle single date click
  const handleSingleSelect = (date: Date | undefined) => {
    setSingleDate(date)
    if (date) {
      updateUrlParams(date, date)
    } else {
      updateUrlParams(undefined, undefined)
    }
  }

  // Handle range select
  const handleRangeSelect = (range: DateRange | undefined) => {
    setRangeDate(range)
    if (range?.from) {
      updateUrlParams(range.from, range.to)
    } else {
      updateUrlParams(undefined, undefined)
    }
  }

  // Quick filter shortcuts
  const applyQuickFilter = (type: 'today' | 'tomorrow' | 'next7' | 'all') => {
    if (type === 'today') {
      const today = new Date()
      setCalendarMode('single')
      setSingleDate(today)
      updateUrlParams(today, today)
    } else if (type === 'tomorrow') {
      const tomorrow = addDays(new Date(), 1)
      setCalendarMode('single')
      setSingleDate(tomorrow)
      updateUrlParams(tomorrow, tomorrow)
    } else if (type === 'next7') {
      const today = new Date()
      const in7Days = addDays(today, 7)
      setCalendarMode('range')
      setRangeDate({ from: today, to: in7Days })
      updateUrlParams(today, in7Days)
    } else {
      setSingleDate(undefined)
      setRangeDate(undefined)
      updateUrlParams(undefined, undefined)
    }
  }

  // Active date display
  const activeDate = singleDate ?? parsedFromDate ?? new Date()

  // Filter schedules displayed for selected date / range
  const displayedSchedules = useMemo(() => {
    return schedules
      .filter((schedule) => {
        const scheduleDate = new Date(schedule.startDateTime)
        if (Number.isNaN(scheduleDate.getTime())) return false

        if (calendarMode === 'range' && rangeDate?.from) {
          const from = startOfDay(rangeDate.from)
          const to = endOfDay(rangeDate.to || rangeDate.from)
          return scheduleDate >= from && scheduleDate <= to
        }

        if (singleDate) {
          return isSameDay(scheduleDate, singleDate)
        }

        return true
      })
      .sort(
        (a, b) =>
          new Date(a.startDateTime).getTime() -
          new Date(b.startDateTime).getTime()
      )
  }, [schedules, calendarMode, rangeDate, singleDate])

  // Group schedules by time period
  const groupedSchedules = useMemo(() => {
    const groups: Record<PeriodType, ISchedule[]> = {
      Morning: [],
      Afternoon: [],
      Evening: []
    }

    displayedSchedules.forEach((schedule) => {
      const period = getPeriod(schedule.startDateTime)
      groups[period].push(schedule)
    })

    return groups
  }, [displayedSchedules])

  // Filter by selected period tab
  const filteredByPeriod = useMemo(() => {
    if (selectedPeriod === 'All') return displayedSchedules
    return groupedSchedules[selectedPeriod]
  }, [selectedPeriod, displayedSchedules, groupedSchedules])

  const totalDays = new Set(
    scheduleDates.map((date) => format(date, 'yyyy-MM-dd'))
  ).size

  const hasActiveFilters = Boolean(startFromUrl || endFromUrl)

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div className='flex justify-between items-center'>
          <Skeleton className='h-8 w-48' />
          <Skeleton className='h-9 w-24' />
        </div>
        <div className='grid gap-4 sm:grid-cols-3'>
          <Skeleton className='h-24 rounded-xl' />
          <Skeleton className='h-24 rounded-xl' />
          <Skeleton className='h-24 rounded-xl' />
        </div>
        <div className='grid gap-6 lg:grid-cols-[340px_1fr]'>
          <Skeleton className='h-[480px] rounded-xl' />
          <Skeleton className='h-[480px] rounded-xl' />
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <Card>
        <CardContent className='flex flex-col items-center gap-3 py-12'>
          <p className='text-sm text-destructive'>
            Failed to load schedules. Please check your connection or try again.
          </p>
          <Button
            variant='outline'
            onClick={() => refetch()}>
            <RefreshCw className='mr-2 h-4 w-4' />
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
        <div>
          <h1 className='text-2xl font-extrabold tracking-tight text-foreground md:text-3xl'>
            Available Schedules
          </h1>
          <p className='mt-1 text-sm text-muted-foreground'>
            Browse and filter schedule windows for patient appointments.
          </p>
        </div>

        <div className='flex items-center gap-2.5'>
          {hasActiveFilters && (
            <Button
              variant='ghost'
              size='sm'
              className='text-xs text-muted-foreground hover:text-foreground'
              onClick={() => applyQuickFilter('all')}>
              Clear Filters
            </Button>
          )}

          <Button
            variant='outline'
            size='sm'
            onClick={() => refetch()}
            disabled={isFetching}
            className='gap-2 shadow-xs'>
            <RefreshCw
              className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className='grid gap-4 sm:grid-cols-3'>
        <Card className='shadow-xs'>
          <CardContent className='flex items-center gap-4 p-5'>
            <div className='flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary'>
              <CalendarCheck className='size-5' />
            </div>
            <div>
              <p className='text-xs font-medium text-muted-foreground'>
                Total Available Schedules
              </p>
              <h3 className='text-2xl font-black text-foreground'>
                {schedules.length}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className='shadow-xs'>
          <CardContent className='flex items-center gap-4 p-5'>
            <div className='flex size-11 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400'>
              <CalendarDays className='size-5' />
            </div>
            <div>
              <p className='text-xs font-medium text-muted-foreground'>
                Scheduled Days
              </p>
              <h3 className='text-2xl font-black text-foreground'>
                {totalDays}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className='shadow-xs'>
          <CardContent className='flex items-center gap-4 p-5'>
            <div className='flex size-11 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'>
              <Clock className='size-5' />
            </div>
            <div>
              <p className='text-xs font-medium text-muted-foreground'>
                Slots for Selected Date
              </p>
              <h3 className='text-2xl font-black text-foreground'>
                {displayedSchedules.length}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar + Schedule Slot Grid */}
      <div className='grid items-start gap-6 lg:grid-cols-[340px_minmax(0,1fr)]'>
        {/* Left Column: Calendar Card */}
        <Card className='shadow-xs'>
          <CardHeader className='pb-3'>
            <div className='flex items-center justify-between'>
              <CardTitle className='text-base font-bold'>
                Filter By Date
              </CardTitle>
              {/* Mode Toggle */}
              <div className='flex rounded-lg border bg-muted/30 p-0.5 text-xs'>
                <button
                  type='button'
                  onClick={() => setCalendarMode('single')}
                  className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                    calendarMode === 'single'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}>
                  Single Day
                </button>
                <button
                  type='button'
                  onClick={() => setCalendarMode('range')}
                  className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                    calendarMode === 'range'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}>
                  Date Range
                </button>
              </div>
            </div>
            <CardDescription className='text-xs'>
              {calendarMode === 'single'
                ? 'Select a date to view available time slots.'
                : 'Select start and end dates to filter by range.'}
            </CardDescription>
          </CardHeader>

          <CardContent className='space-y-4 px-3 sm:px-4'>
            {/* Quick Filter Shortcuts */}
            <div className='flex flex-wrap gap-1.5'>
              <Button
                variant='outline'
                size='sm'
                className='h-7 px-2.5 text-xs'
                onClick={() => applyQuickFilter('today')}>
                Today
              </Button>
              <Button
                variant='outline'
                size='sm'
                className='h-7 px-2.5 text-xs'
                onClick={() => applyQuickFilter('tomorrow')}>
                Tomorrow
              </Button>
              <Button
                variant='outline'
                size='sm'
                className='h-7 px-2.5 text-xs'
                onClick={() => applyQuickFilter('next7')}>
                Next 7 Days
              </Button>
              <Button
                variant='ghost'
                size='sm'
                className='h-7 px-2.5 text-xs text-muted-foreground hover:text-foreground'
                onClick={() => applyQuickFilter('all')}>
                All Dates
              </Button>
            </div>

            <Separator />

            {/* Interactive Calendar with past dates disabled */}
            {calendarMode === 'single' ? (
              <Calendar
                mode='single'
                selected={activeDate}
                onSelect={handleSingleSelect}
                disabled={{ before: todayStart }}
                modifiers={{
                  hasSchedule: scheduleDates
                }}
                modifiersClassNames={{
                  hasSchedule:
                    'relative font-semibold after:absolute after:bottom-1 after:left-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-primary'
                }}
                className='w-full p-0'
              />
            ) : (
              <Calendar
                mode='range'
                selected={rangeDate}
                onSelect={handleRangeSelect}
                disabled={{ before: todayStart }}
                modifiers={{
                  hasSchedule: scheduleDates
                }}
                modifiersClassNames={{
                  hasSchedule:
                    'relative font-semibold after:absolute after:bottom-1 after:left-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-primary'
                }}
                className='w-full p-0'
              />
            )}

            <Separator />

            <div className='flex items-center gap-2 px-1 text-xs text-muted-foreground'>
              <span className='size-2 rounded-full bg-primary' />
              <span>Dates with scheduled slots</span>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Schedule Slots Card */}
        <Card className='min-h-[480px] shadow-xs'>
          <CardHeader className='border-b border-border/60 pb-4'>
            <div className='flex flex-col justify-between gap-3 sm:flex-row sm:items-center'>
              <div>
                <div className='flex items-center gap-2'>
                  <CalendarIcon className='size-4 text-primary' />
                  <CardTitle className='text-base font-bold'>
                    {calendarMode === 'range' && rangeDate?.from
                      ? `${format(rangeDate.from, 'MMM dd, yyyy')} — ${
                          rangeDate.to
                            ? format(rangeDate.to, 'MMM dd, yyyy')
                            : format(rangeDate.from, 'MMM dd, yyyy')
                        }`
                      : format(activeDate, 'EEEE, MMMM dd, yyyy')}
                  </CardTitle>
                </div>
                <CardDescription className='mt-0.5 text-xs'>
                  Available consultation windows for patient bookings.
                </CardDescription>
              </div>

              <Badge
                variant='secondary'
                className='font-semibold'>
                {displayedSchedules.length}{' '}
                {displayedSchedules.length === 1 ? 'Slot' : 'Slots'}
              </Badge>
            </div>

            {/* Period Tabs: All, Morning, Afternoon, Evening */}
            {displayedSchedules.length > 0 && (
              <div className='flex items-center gap-1.5 pt-3'>
                <Button
                  variant={selectedPeriod === 'All' ? 'default' : 'outline'}
                  size='sm'
                  className='h-7 text-xs'
                  onClick={() => setSelectedPeriod('All')}>
                  All ({displayedSchedules.length})
                </Button>
                <Button
                  variant={selectedPeriod === 'Morning' ? 'default' : 'outline'}
                  size='sm'
                  className='h-7 text-xs gap-1'
                  onClick={() => setSelectedPeriod('Morning')}>
                  <Sunrise className='size-3 text-amber-500' />
                  Morning ({groupedSchedules.Morning.length})
                </Button>
                <Button
                  variant={
                    selectedPeriod === 'Afternoon' ? 'default' : 'outline'
                  }
                  size='sm'
                  className='h-7 text-xs gap-1'
                  onClick={() => setSelectedPeriod('Afternoon')}>
                  <Sun className='size-3 text-orange-500' />
                  Afternoon ({groupedSchedules.Afternoon.length})
                </Button>
                <Button
                  variant={selectedPeriod === 'Evening' ? 'default' : 'outline'}
                  size='sm'
                  className='h-7 text-xs gap-1'
                  onClick={() => setSelectedPeriod('Evening')}>
                  <Sunset className='size-3 text-indigo-500' />
                  Evening ({groupedSchedules.Evening.length})
                </Button>
              </div>
            )}
          </CardHeader>

          <CardContent className='p-6'>
            {filteredByPeriod.length === 0 ? (
              <div className='flex min-h-[320px] flex-col items-center justify-center gap-3 text-center'>
                <div className='rounded-full bg-muted/60 p-4'>
                  <CalendarDays className='size-8 text-muted-foreground' />
                </div>
                <h3 className='text-base font-semibold text-foreground'>
                  No schedules found
                </h3>
                <p className='max-w-sm text-xs text-muted-foreground'>
                  There are no schedule windows matching your selected date or
                  period. Choose another date from the calendar or clear filters
                  to browse all upcoming slots.
                </p>
                <Button
                  variant='outline'
                  size='sm'
                  className='mt-2'
                  onClick={() => applyQuickFilter('today')}>
                  View Today&apos;s Slots
                </Button>
              </div>
            ) : (
              <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-3'>
                {filteredByPeriod.map((schedule) => {
                  const start = parseISO(schedule.startDateTime)
                  const end = parseISO(schedule.endDateTime)
                  const duration = Math.round(
                    (end.getTime() - start.getTime()) / 60000
                  )

                  const period = getPeriod(schedule.startDateTime)
                  const periodMeta = periodConfig[period]
                  const PeriodIcon = periodMeta.icon

                  // Check booking status
                  const isBooked =
                    schedule.doctorSchedules?.some((ds) => ds.isBooked) ?? false

                  return (
                    <div
                      key={schedule.id}
                      className='group relative flex flex-col justify-between rounded-xl border border-border/80 bg-card p-4 shadow-xs transition-all duration-200 hover:border-primary/50 hover:shadow-md'>
                      {/* Top Badges */}
                      <div className='flex items-center justify-between gap-2'>
                        <span
                          className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium ${periodMeta.badgeClass}`}>
                          <PeriodIcon className='size-3' />
                          {period}
                        </span>

                        <Badge
                          variant='outline'
                          className='text-[10px] font-medium'>
                          <Clock className='mr-1 size-2.5' />
                          {duration > 0 ? `${duration} min` : 'Custom'}
                        </Badge>
                      </div>

                      {/* Time Slots */}
                      <div className='my-3 space-y-0.5'>
                        <p className='text-base font-bold text-foreground'>
                          {formatTime(schedule.startDateTime)} —{' '}
                          {formatTime(schedule.endDateTime)}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          {format24hTime(schedule.startDateTime)} —{' '}
                          {format24hTime(schedule.endDateTime)} (24h)
                        </p>
                      </div>

                      {/* Bottom Status */}
                      <div className='flex items-center justify-between border-t border-border/50 pt-2.5 text-xs'>
                        <span className='font-mono text-[10px] text-muted-foreground'>
                          ID: {schedule.id.slice(0, 8)}
                        </span>
                        <Badge
                          variant={isBooked ? 'secondary' : 'outline'}
                          className={
                            !isBooked
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300'
                              : ''
                          }>
                          {isBooked ? 'Booked' : 'Available'}
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DoctorScheduleManagementContent
