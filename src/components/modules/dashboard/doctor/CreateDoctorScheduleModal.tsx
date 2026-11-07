'use client'

import AppModal from '@/components/shared/AppModal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { createDoctorWiseSchedule } from '@/service/doctorSchedule.service'
import { getSchedules } from '@/service/schedule.service'
import { ISchedule } from '@/types/schedule.types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  addDays,
  endOfDay,
  format,
  isSameDay,
  parseISO,
  startOfDay
} from 'date-fns'
import {
  CalendarDays,
  CalendarIcon,
  Check,
  CheckCircle2,
  Clock,
  LoaderCircle,
  Plus,
  RefreshCw,
  Sun,
  Sunrise,
  Sunset
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { toast } from 'sonner'

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

const CreateDoctorScheduleModal = () => {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const router = useRouter()

  // Selected schedule IDs to claim
  const [selectedScheduleIds, setSelectedScheduleIds] = useState<Set<string>>(
    new Set()
  )

  // Date range filter for calendar (default today to 7 days ahead)
  const today = useMemo(() => new Date(), [])
  const todayStart = useMemo(() => startOfDay(today), [today])
  const [rangeDate, setRangeDate] = useState<DateRange | undefined>({
    from: today,
    to: addDays(today, 7)
  })

  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType | 'All'>(
    'All'
  )

  // Construct query string for fetching available hospital schedules
  const queryString = useMemo(() => {
    if (!rangeDate?.from) return ''
    const startIso = startOfDay(rangeDate.from).toISOString()
    const endIso = endOfDay(rangeDate.to || rangeDate.from).toISOString()
    return `startDateTime[gte]=${encodeURIComponent(startIso)}&endDateTime[lte]=${encodeURIComponent(endIso)}&limit=100`
  }, [rangeDate])

  const {
    data: schedulesResponse,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ['available-schedules', queryString],
    queryFn: () => getSchedules(queryString),
    enabled: open
  })

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createDoctorWiseSchedule
  })

  // Extract schedules array
  const schedules: ISchedule[] = useMemo(() => {
    if (!schedulesResponse) return []
    const raw = schedulesResponse.data
    if (Array.isArray(raw)) return raw
    if (
      raw &&
      typeof raw === 'object' &&
      'data' in raw &&
      Array.isArray((raw as unknown as { data: ISchedule[] }).data)
    ) {
      return (raw as unknown as { data: ISchedule[] }).data
    }
    if (Array.isArray(schedulesResponse)) {
      return schedulesResponse as unknown as ISchedule[]
    }
    return []
  }, [schedulesResponse])

  // Dates with schedules for calendar dots
  const scheduleDates = useMemo(
    () => schedules.map((schedule) => new Date(schedule.startDateTime)),
    [schedules]
  )

  // Filter schedules within selected date range
  const displayedSchedules = useMemo(() => {
    return schedules
      .filter((schedule) => {
        const scheduleDate = new Date(schedule.startDateTime)
        if (Number.isNaN(scheduleDate.getTime())) return false

        if (rangeDate?.from) {
          const from = startOfDay(rangeDate.from)
          const to = endOfDay(rangeDate.to || rangeDate.from)
          return scheduleDate >= from && scheduleDate <= to
        }

        return true
      })
      .sort(
        (a, b) =>
          new Date(a.startDateTime).getTime() -
          new Date(b.startDateTime).getTime()
      )
  }, [schedules, rangeDate])

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

  // Filter by active period tab
  const filteredByPeriod = useMemo(() => {
    if (selectedPeriod === 'All') return displayedSchedules
    return groupedSchedules[selectedPeriod]
  }, [selectedPeriod, displayedSchedules, groupedSchedules])

  // Toggle single schedule selection
  const toggleScheduleSelection = (id: string) => {
    setSelectedScheduleIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  // Select all or clear visible slots
  const handleSelectAllVisible = () => {
    const visibleIds = filteredByPeriod.map((s) => s.id)
    const allSelected = visibleIds.every((id) => selectedScheduleIds.has(id))

    setSelectedScheduleIds((prev) => {
      const next = new Set(prev)
      if (allSelected) {
        visibleIds.forEach((id) => next.delete(id))
      } else {
        visibleIds.forEach((id) => next.add(id))
      }
      return next
    })
  }

  // Quick preset shortcuts
  const applyQuickFilter = (type: 'today' | 'tomorrow' | 'next7' | 'all') => {
    if (type === 'today') {
      setRangeDate({ from: today, to: today })
    } else if (type === 'tomorrow') {
      const tomorrow = addDays(today, 1)
      setRangeDate({ from: tomorrow, to: tomorrow })
    } else if (type === 'next7') {
      setRangeDate({ from: today, to: addDays(today, 7) })
    } else {
      setRangeDate(undefined)
    }
  }

  // Submit selected schedules
  const handleSubmit = async () => {
    if (selectedScheduleIds.size === 0) {
      toast.error('Please select at least one schedule slot.')
      return
    }

    try {
      const result = await mutateAsync({
        scheduleIds: Array.from(selectedScheduleIds)
      })

      if (result && 'success' in result && !result.success) {
        toast.error(
          (result as { message?: string }).message || 'Failed to add schedules'
        )
        return
      }

      toast.success(
        `Successfully added ${selectedScheduleIds.size} schedule slot${
          selectedScheduleIds.size > 1 ? 's' : ''
        }!`
      )
      setOpen(false)
      setSelectedScheduleIds(new Set())
      await queryClient.invalidateQueries({
        queryKey: ['doctor-wise-schedules']
      })
      await queryClient.invalidateQueries({
        queryKey: ['schedules']
      })
      router.refresh()
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to create doctor schedule.'
      )
    }
  }

  const allVisibleSelected =
    filteredByPeriod.length > 0 &&
    filteredByPeriod.every((s) => selectedScheduleIds.has(s.id))

  return (
    <AppModal
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) {
          setSelectedScheduleIds(new Set())
        }
      }}
      size='4xl'
      title='Select Available Schedules'
      description='Browse hospital schedules and select the slots you want to take for your appointments.'
      icon={<CalendarIcon className='size-5 text-primary' />}
      trigger={
        <Button className='gap-2 shadow-xs'>
          <Plus className='size-4' />
          Add Doctor Schedule
        </Button>
      }
      footer={
        <div className='flex w-full items-center justify-between gap-4'>
          <div className='flex items-center gap-2'>
            <Badge
              variant='secondary'
              className='px-2.5 py-1 text-xs font-semibold'>
              <CheckCircle2 className='mr-1.5 size-3.5 text-primary' />
              {selectedScheduleIds.size} slot
              {selectedScheduleIds.size === 1 ? '' : 's'} selected
            </Badge>
            {selectedScheduleIds.size > 0 && (
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='h-7 text-xs text-muted-foreground hover:text-foreground'
                onClick={() => setSelectedScheduleIds(new Set())}>
                Clear
              </Button>
            )}
          </div>

          <div className='flex items-center gap-2.5'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setOpen(false)}
              disabled={isPending}>
              Cancel
            </Button>
            <Button
              type='button'
              disabled={selectedScheduleIds.size === 0 || isPending}
              onClick={handleSubmit}
              className='gap-2'>
              {isPending && <LoaderCircle className='size-4 animate-spin' />}
              {isPending
                ? 'Adding...'
                : `Add Selected Slots (${selectedScheduleIds.size})`}
            </Button>
          </div>
        </div>
      }>
      <div className='grid gap-6 pt-1 lg:grid-cols-[300px_minmax(0,1fr)]'>
        {/* Left Column: Range Calendar */}
        <div className='space-y-3.5 rounded-xl border border-border/70 bg-card p-3.5 shadow-2xs'>
          <div className='flex items-center justify-between'>
            <p className='text-xs font-bold uppercase tracking-wider text-primary'>
              Select Date Range
            </p>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              className='h-6 px-1.5 text-[11px] text-muted-foreground'
              onClick={() => void refetch()}
              disabled={isFetching}>
              <RefreshCw
                className={`size-3 ${isFetching ? 'animate-spin' : ''}`}
              />
            </Button>
          </div>

          {/* Quick Presets */}
          <div className='flex flex-wrap gap-1'>
            <Button
              type='button'
              variant='outline'
              size='sm'
              className='h-6 px-2 text-[10px]'
              onClick={() => applyQuickFilter('today')}>
              Today
            </Button>
            <Button
              type='button'
              variant='outline'
              size='sm'
              className='h-6 px-2 text-[10px]'
              onClick={() => applyQuickFilter('tomorrow')}>
              Tomorrow
            </Button>
            <Button
              type='button'
              variant='outline'
              size='sm'
              className='h-6 px-2 text-[10px]'
              onClick={() => applyQuickFilter('next7')}>
              Next 7 Days
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              className='h-6 px-2 text-[10px] text-muted-foreground hover:text-foreground'
              onClick={() => applyQuickFilter('all')}>
              All Upcoming
            </Button>
          </div>

          <Separator />

          {/* Range Calendar (Single Day / Date Range toggle removed as requested) */}
          <Calendar
            mode='range'
            selected={rangeDate}
            onSelect={setRangeDate}
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

          <Separator />

          <div className='flex items-center gap-2 px-1 text-[11px] text-muted-foreground'>
            <span className='size-2 rounded-full bg-primary' />
            <span>Dates with available schedules</span>
          </div>
        </div>

        {/* Right Column: Available Slots */}
        <div className='flex flex-col space-y-4'>
          {/* Header & Period Filters */}
          <div className='flex flex-col justify-between gap-3 border-b border-border/60 pb-3 sm:flex-row sm:items-center'>
            <div>
              <p className='text-sm font-bold text-foreground'>
                {rangeDate?.from
                  ? `${format(rangeDate.from, 'MMM dd, yyyy')}${
                      rangeDate.to
                        ? ` — ${format(rangeDate.to, 'MMM dd, yyyy')}`
                        : ''
                    }`
                  : 'All Available Schedules'}
              </p>
              <p className='text-xs text-muted-foreground'>
                Click slots to select or deselect.
              </p>
            </div>

            {displayedSchedules.length > 0 && (
              <Button
                type='button'
                variant='outline'
                size='sm'
                className='h-7 text-xs'
                onClick={handleSelectAllVisible}>
                {allVisibleSelected ? 'Deselect All' : 'Select All Visible'}
              </Button>
            )}
          </div>

          {/* Period Tabs */}
          {displayedSchedules.length > 0 && (
            <div className='flex flex-wrap items-center gap-1.5'>
              <Button
                type='button'
                variant={selectedPeriod === 'All' ? 'default' : 'outline'}
                size='sm'
                className='h-7 text-xs'
                onClick={() => setSelectedPeriod('All')}>
                All ({displayedSchedules.length})
              </Button>
              <Button
                type='button'
                variant={selectedPeriod === 'Morning' ? 'default' : 'outline'}
                size='sm'
                className='h-7 text-xs gap-1'
                onClick={() => setSelectedPeriod('Morning')}>
                <Sunrise className='size-3 text-amber-500' />
                Morning ({groupedSchedules.Morning.length})
              </Button>
              <Button
                type='button'
                variant={selectedPeriod === 'Afternoon' ? 'default' : 'outline'}
                size='sm'
                className='h-7 text-xs gap-1'
                onClick={() => setSelectedPeriod('Afternoon')}>
                <Sun className='size-3 text-orange-500' />
                Afternoon ({groupedSchedules.Afternoon.length})
              </Button>
              <Button
                type='button'
                variant={selectedPeriod === 'Evening' ? 'default' : 'outline'}
                size='sm'
                className='h-7 text-xs gap-1'
                onClick={() => setSelectedPeriod('Evening')}>
                <Sunset className='size-3 text-indigo-500' />
                Evening ({groupedSchedules.Evening.length})
              </Button>
            </div>
          )}

          {/* Slots Content */}
          <div className='min-h-[340px] max-h-[460px] overflow-y-auto pr-1'>
            {isLoading ? (
              <div className='grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3'>
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className='h-24 rounded-xl'
                  />
                ))}
              </div>
            ) : filteredByPeriod.length === 0 ? (
              <Card className='border-dashed'>
                <CardContent className='flex min-h-[260px] flex-col items-center justify-center gap-2 p-6 text-center'>
                  <CalendarDays className='size-8 text-muted-foreground/60' />
                  <p className='text-sm font-semibold text-foreground'>
                    No schedules available
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    No unassigned schedules were found for the selected date
                    range. Try selecting another date or range.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className='grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3'>
                {filteredByPeriod.map((schedule) => {
                  const isSelected = selectedScheduleIds.has(schedule.id)
                  const period = getPeriod(schedule.startDateTime)
                  const periodMeta = periodConfig[period]
                  const PeriodIcon = periodMeta.icon

                  const start = new Date(schedule.startDateTime)
                  const end = new Date(schedule.endDateTime)
                  const duration = Math.round(
                    (end.getTime() - start.getTime()) / 60000
                  )

                  return (
                    <button
                      key={schedule.id}
                      type='button'
                      onClick={() => toggleScheduleSelection(schedule.id)}
                      className={`group relative flex flex-col justify-between rounded-xl border p-3.5 text-left transition-all duration-200 ${
                        isSelected
                          ? 'border-primary bg-primary/5 shadow-xs '
                          : 'border-border/80 bg-card hover:border-primary/40 hover:bg-accent/40 hover:shadow-2xs'
                      }`}>
                      {/* Top Badges */}
                      <div className='flex items-center justify-between gap-2'>
                        <span
                          className={`inline-flex items-center gap-1 rounded-xl border px-2 py-0.5 text-[10px] font-medium ${periodMeta.badgeClass}`}>
                          <PeriodIcon className='size-2.5' />
                          {period}
                        </span>

                        <div className='flex items-center gap-1.5'>
                          <Badge
                            variant='outline'
                            className='h-5 px-1.5 text-[10px] font-medium'>
                            <Clock className='mr-1 size-2.5' />
                            {duration > 0 ? `${duration} min` : 'Custom'}
                          </Badge>
                        </div>
                      </div>

                      {/* Time Details */}
                      <div className='my-2.5 space-y-0.5'>
                        <p className='text-sm font-bold text-foreground'>
                          {formatTime(schedule.startDateTime)} —{' '}
                          {formatTime(schedule.endDateTime)}
                        </p>
                        <p className='text-[11px] text-muted-foreground'>
                          {format24hTime(schedule.startDateTime)} —{' '}
                          {format24hTime(schedule.endDateTime)} (24h)
                        </p>
                      </div>

                      {/* Date Badge */}
                      <div className='flex items-center justify-between border-t border-border/40 pt-2 text-[10px] text-muted-foreground'>
                        <span>{format(start, 'EEE, MMM dd, yyyy')}</span>
                        <span className='font-mono'>
                          ID: {schedule.id.slice(0, 6)}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppModal>
  )
}

export default CreateDoctorScheduleModal
