'use client'

import DateCell from '@/components/modules/dashboard/DateCell'
import CreateDoctorScheduleModal from '@/components/modules/dashboard/doctor/CreateDoctorScheduleModal'
import DeleteDoctorScheduleConfirmationDialog from '@/components/modules/dashboard/doctor/DeleteDoctorScheduleConfirmationDialog'
import DataTable from '@/components/shared/DataTable'
import {
  DataTableFilterConfig,
  DataTableFilterValues
} from '@/components/shared/DataTableFilters'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useRowActionModalState } from '@/hooks/useRowActionModalState'
import { useServerManagedDataTable } from '@/hooks/useServerManagedDataTable'
import {
  serverManagedFilter,
  useServerManagedDataTableFilters
} from '@/hooks/useServerManagedDataTableFilters'
import { useServerManagedDataTableSearch } from '@/hooks/useServerManagedDataTableSearch'
import { getDoctorWiseSchedules } from '@/service/doctorSchedule.service'
import { PaginationMeta } from '@/types/api.types'
import { IDoctorSchedule } from '@/types/schedule.types'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { createColumnHelper, tableFeatures } from '@tanstack/react-table'
import { Calendar, Clock, RotateCcw, Sun, Sunrise, Sunset } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10

const DOCTOR_SCHEDULE_FILTER_DEFINITIONS = [
  serverManagedFilter.single('isBooked')
]

const formatScheduleDate = (startDateTime?: string) => {
  if (!startDateTime) return 'N/A'
  const date = new Date(startDateTime)
  return Number.isNaN(date.getTime())
    ? 'N/A'
    : date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
}

const formatScheduleTime = (startDateTime?: string, endDateTime?: string) => {
  if (!startDateTime) return 'N/A'
  const start = new Date(startDateTime)
  const end = endDateTime ? new Date(endDateTime) : null

  if (Number.isNaN(start.getTime())) return 'N/A'

  const startTimeStr = start.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })

  if (end && !Number.isNaN(end.getTime())) {
    const endTimeStr = end.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
    return `${startTimeStr} — ${endTimeStr}`
  }

  return startTimeStr
}

const getScheduleDuration = (startDateTime?: string, endDateTime?: string) => {
  if (!startDateTime || !endDateTime) return null
  const start = new Date(startDateTime)
  const end = new Date(endDateTime)
  const diffMinutes = Math.round((end.getTime() - start.getTime()) / 60000)
  return Number.isFinite(diffMinutes) && diffMinutes > 0
    ? `${diffMinutes} mins`
    : null
}

const getPeriodBadge = (startDateTime?: string) => {
  if (!startDateTime) return null
  const date = new Date(startDateTime)
  if (Number.isNaN(date.getTime())) return null
  const hour = date.getHours()

  if (hour < 12) {
    return {
      label: 'Morning',
      icon: Sunrise,
      className:
        'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
    }
  }
  if (hour < 17) {
    return {
      label: 'Afternoon',
      icon: Sun,
      className:
        'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800'
    }
  }
  return {
    label: 'Evening',
    icon: Sunset,
    className:
      'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800'
  }
}

const MyDoctorSchedulesTable = () => {
  type TableFeatures = ReturnType<typeof tableFeatures>
  const columnHelper = createColumnHelper<TableFeatures, IDoctorSchedule>()
  const searchParams = useSearchParams()

  const {
    queryStringFromUrl,
    optimisticSortingState,
    optimisticPaginationState,
    isRouteRefreshPending,
    updateParams,
    handleSortingChange,
    handlePaginationChange
  } = useServerManagedDataTable({
    searchParams,
    defaultPage: DEFAULT_PAGE,
    defaultLimit: DEFAULT_LIMIT
  })

  const { deletingItem, isDeleteDialogOpen, onDeleteOpenChange, tableActions } =
    useRowActionModalState<IDoctorSchedule>({
      enableView: false,
      enableEdit: false,
      enableDelete: true
    })

  const queryString = queryStringFromUrl

  // Fetch doctor's personal schedules from /doctorSchedule/doctor-wise-schedules
  const {
    data: doctorSchedulesResponse,
    isLoading,
    isFetching,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['doctor-wise-schedules', queryString] as const,
    queryFn: ({ queryKey: [, query] }) => getDoctorWiseSchedules(query),
    placeholderData: keepPreviousData
  })

  const responseData = doctorSchedulesResponse?.data
  const doctorSchedules: IDoctorSchedule[] = useMemo(() => {
    if (!responseData) return []
    if (Array.isArray(responseData)) return responseData
    if (
      'data' in responseData &&
      Array.isArray(
        (responseData as unknown as { data: IDoctorSchedule[] }).data
      )
    ) {
      return (responseData as unknown as { data: IDoctorSchedule[] }).data
    }
    return []
  }, [responseData])

  const meta: PaginationMeta | undefined =
    doctorSchedulesResponse?.meta ??
    (responseData && 'meta' in responseData
      ? (responseData as unknown as { meta: PaginationMeta }).meta
      : undefined)

  const { filterValues, handleFilterChange, clearAllFilters } =
    useServerManagedDataTableFilters({
      searchParams,
      definitions: DOCTOR_SCHEDULE_FILTER_DEFINITIONS,
      updateParams
    })

  const filterConfigs = useMemo<DataTableFilterConfig[]>(() => {
    return [
      {
        id: 'isBooked',
        label: 'Booking Status',
        type: 'single-select',
        options: [
          { label: 'Available', value: 'false' },
          { label: 'Booked', value: 'true' }
        ]
      }
    ]
  }, [])

  const filterValuesForTable = useMemo<DataTableFilterValues>(() => {
    return {
      isBooked: filterValues.isBooked
    }
  }, [filterValues])

  const { searchTermFromUrl, handleDebouncedSearchChange } =
    useServerManagedDataTableSearch({
      searchParams,
      updateParams
    })

  const hasActiveFilters = Boolean(filterValues.isBooked)

  const emptyMessage =
    searchTermFromUrl || hasActiveFilters
      ? 'No schedules match these filter criteria.'
      : 'You have not added any personal schedules yet. Click "Add Doctor Schedule" to select your consultation hours.'

  const fetchError = isError
    ? error instanceof Error
      ? error.message
      : 'Unable to load your schedules.'
    : doctorSchedulesResponse?.success === false
      ? doctorSchedulesResponse.message
      : undefined

  const columns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor((row) => row.schedule?.startDateTime, {
          id: 'scheduleDate',
          header: 'Date',
          enableSorting: true,
          cell: ({ row }) => {
            const startDateTime = row.original.schedule?.startDateTime
            return (
              <div className='flex items-center gap-2'>
                <div className='flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                  <Calendar className='size-4' />
                </div>
                <div>
                  <p className='text-foreground'>
                    {formatScheduleDate(startDateTime)}
                  </p>
                  <p className='font-mono text-[10px] text-muted-foreground'>
                    ID: {row.original.scheduleId?.slice(0, 8) || 'N/A'}
                  </p>
                </div>
              </div>
            )
          }
        }),
        columnHelper.accessor((row) => row.schedule?.startDateTime, {
          id: 'timeSlot',
          header: 'Time Window',
          enableSorting: false,
          cell: ({ row }) => {
            const schedule = row.original.schedule
            const formattedTime = formatScheduleTime(
              schedule?.startDateTime,
              schedule?.endDateTime
            )
            const duration = getScheduleDuration(
              schedule?.startDateTime,
              schedule?.endDateTime
            )
            const period = getPeriodBadge(schedule?.startDateTime)
            const PeriodIcon = period?.icon

            return (
              <div className='space-y-1'>
                <div className='flex items-center gap-2 font-medium text-foreground'>
                  <Clock className='size-3.5 text-muted-foreground' />
                  <span>{formattedTime}</span>
                  {duration && (
                    <Badge
                      variant='outline'
                      className='h-5 px-1.5 text-[10px]'>
                      {duration}
                    </Badge>
                  )}
                </div>
                {period && PeriodIcon && (
                  <span
                    className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.2 text-[10px] font-medium ${period.className}`}>
                    <PeriodIcon className='size-2.5' />
                    {period.label}
                  </span>
                )}
              </div>
            )
          }
        }),
        columnHelper.accessor('isBooked', {
          id: 'isBooked',
          header: 'Booking Status',
          enableSorting: true,
          cell: ({ getValue }) => {
            const isBooked = getValue()
            return (
              <Badge
                variant={isBooked ? 'secondary' : 'outline'}
                className={
                  !isBooked
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                    : 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                }>
                <span className='text-xs font-semibold'>
                  {isBooked ? 'Booked' : 'Available'}
                </span>
              </Badge>
            )
          }
        }),
        columnHelper.accessor('createdAt', {
          id: 'createdAt',
          header: 'Added On',
          enableSorting: true,
          cell: ({ getValue }) => (
            <DateCell
              date={getValue()}
              formatString='MMM dd, yyyy'
            />
          )
        })
      ]),
    [columnHelper]
  )

  return (
    <section className='mx-auto w-full max-w-[1600px] space-y-5 px-4 py-5 md:px-8 md:py-7'>
      <header className='flex flex-wrap items-end justify-between gap-4'>
        <div>
          <p className='mb-1 text-xs font-bold uppercase tracking-wider text-primary'>
            Availability Management
          </p>
          <h1 className='text-2xl font-extrabold text-foreground'>
            My Schedules
          </h1>
          <p className='mt-1 text-sm text-muted-foreground'>
            Browse and manage your personal consultation schedule slots.
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <div className='rounded-md border border-border bg-card px-3 py-2 text-sm text-muted-foreground shadow-2xs'>
            <span className='font-semibold tabular-nums text-foreground'>
              {meta?.total ?? doctorSchedules.length}
            </span>{' '}
            {meta?.total === 1 || doctorSchedules.length === 1
              ? 'schedule'
              : 'schedules'}
          </div>
          <CreateDoctorScheduleModal />
        </div>
      </header>

      {fetchError && (
        <div
          className='flex flex-wrap items-center justify-between gap-3 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm'
          role='alert'>
          <p className='text-muted-foreground'>{fetchError}</p>
          <Button
            type='button'
            size='sm'
            variant='outline'
            onClick={() => void refetch()}
            disabled={isFetching}>
            <RotateCcw className='size-3.5 mr-1.5' /> Retry
          </Button>
        </div>
      )}

      <DataTable
        data={doctorSchedules}
        columns={columns}
        isLoading={isLoading}
        isFetching={isFetching}
        isUpdating={isRouteRefreshPending}
        error={fetchError}
        onRetry={() => void refetch()}
        emptyMessage={emptyMessage}
        sorting={{
          state: optimisticSortingState,
          onSortingChange: handleSortingChange
        }}
        pagination={{
          state: optimisticPaginationState,
          onPaginationChange: handlePaginationChange
        }}
        search={{
          initialValue: searchTermFromUrl,
          placeholder: 'Search schedule ID...',
          debounceMs: 500,
          onDebouncedChange: handleDebouncedSearchChange
        }}
        filters={{
          configs: filterConfigs,
          values: filterValuesForTable,
          onFilterChange: handleFilterChange,
          onClearAll: clearAllFilters
        }}
        meta={meta}
        actions={tableActions}
      />

      <DeleteDoctorScheduleConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={onDeleteOpenChange}
        doctorSchedule={deletingItem}
      />
    </section>
  )
}

export default MyDoctorSchedulesTable
