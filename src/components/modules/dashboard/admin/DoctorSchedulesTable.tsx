'use client'

import DateCell from '@/components/modules/dashboard/DateCell'
import UserInfoCell from '@/components/modules/dashboard/UserInfoCell'
import DataTable from '@/components/shared/DataTable'
import {
  DataTableFilterConfig,
  DataTableFilterValues
} from '@/components/shared/DataTableFilters'
import { Badge } from '@/components/ui/badge'
import { useServerManagedDataTable } from '@/hooks/useServerManagedDataTable'
import {
  serverManagedFilter,
  useServerManagedDataTableFilters
} from '@/hooks/useServerManagedDataTableFilters'
import { useServerManagedDataTableSearch } from '@/hooks/useServerManagedDataTableSearch'
import { getDoctorWiseSchedules } from '@/service/doctorSchedule.service'
import { getDoctors } from '@/service/doctor.service'
import { PaginationMeta } from '@/types/api.types'
import { IDoctor } from '@/types/doctor.types'
import { IDoctorSchedule } from '@/types/schedule.types'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { createColumnHelper, tableFeatures } from '@tanstack/react-table'
import { CalendarClock, Clock } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10

const DOCTOR_SCHEDULE_FILTER_DEFINITIONS = [
  serverManagedFilter.single('isBooked'),
  serverManagedFilter.single('doctorId')
]

const formatScheduleDate = (startDateTime?: string) => {
  if (!startDateTime) return 'N/A'
  const date = new Date(startDateTime)
  return Number.isNaN(date.getTime())
    ? 'N/A'
    : date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
}

const formatScheduleTime = (
  startDateTime?: string,
  endDateTime?: string
) => {
  if (!startDateTime) return ''
  const start = new Date(startDateTime)
  const end = endDateTime ? new Date(endDateTime) : null

  if (Number.isNaN(start.getTime())) return ''

  const startTimeStr = start.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })

  if (end && !Number.isNaN(end.getTime())) {
    const endTimeStr = end.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
    return `${startTimeStr} - ${endTimeStr}`
  }

  return startTimeStr
}

const getScheduleDuration = (
  startDateTime?: string,
  endDateTime?: string
) => {
  if (!startDateTime || !endDateTime) return null
  const start = new Date(startDateTime)
  const end = new Date(endDateTime)
  const diffMinutes = Math.round((end.getTime() - start.getTime()) / 60000)
  return Number.isFinite(diffMinutes) && diffMinutes > 0
    ? `${diffMinutes} mins`
    : null
}

const DoctorSchedulesTable = () => {
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

  const queryString = queryStringFromUrl

  // Fetch doctor schedules
  const {
    data: doctorSchedulesResponse,
    isLoading,
    isFetching,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['doctor-schedules', queryString] as const,
    queryFn: ({ queryKey: [, queryString] }) =>
      getDoctorWiseSchedules(queryString),
    placeholderData: keepPreviousData
  })

  // Fetch doctors for filter dropdown
  const { data: doctorsResponse } = useQuery({
    queryKey: ['doctors-list'],
    queryFn: () => getDoctors('limit=100'),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 6
  })

  const doctors = useMemo<IDoctor[]>(() => {
    const data = doctorsResponse?.data
    if (Array.isArray(data)) return data
    if (data && 'data' in data && Array.isArray((data as unknown as { data: IDoctor[] }).data)) {
      return (data as unknown as { data: IDoctor[] }).data
    }
    return []
  }, [doctorsResponse])

  const responseData = doctorSchedulesResponse?.data
  const doctorSchedules: IDoctorSchedule[] = useMemo(() => {
    if (Array.isArray(responseData)) return responseData
    if (responseData && 'data' in responseData && Array.isArray((responseData as unknown as { data: IDoctorSchedule[] }).data)) {
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
          { label: 'Booked', value: 'true' },
          { label: 'Available', value: 'false' }
        ]
      },
      {
        id: 'doctorId',
        label: 'Doctor',
        type: 'single-select',
        options: doctors.map((doctor) => ({
          label: doctor.name,
          value: String(doctor.id)
        }))
      }
    ]
  }, [doctors])

  const filterValuesForTable = useMemo<DataTableFilterValues>(() => {
    return {
      isBooked: filterValues.isBooked,
      doctorId: filterValues.doctorId
    }
  }, [filterValues])

  const { searchTermFromUrl, handleDebouncedSearchChange } =
    useServerManagedDataTableSearch({
      searchParams,
      updateParams
    })

  const hasActiveFilters = Boolean(
    filterValues.isBooked || filterValues.doctorId
  )

  const emptyMessage =
    searchTermFromUrl || hasActiveFilters
      ? 'No doctor schedules match these search criteria.'
      : 'No doctor schedules are available yet.'

  const fetchError = isError
    ? error instanceof Error
      ? error.message
      : 'Unable to load doctor schedules.'
    : doctorSchedulesResponse?.success === false
      ? doctorSchedulesResponse.message
      : undefined

  const columns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor('doctor', {
          id: 'doctor',
          header: 'Doctor',
          enableSorting: false,
          cell: ({ row }) => {
            const doctor = row.original.doctor
            return (
              <div className='flex items-center gap-2'>
                <UserInfoCell
                  name={doctor?.name || `Doctor ID: ${row.original.doctorId}`}
                  email={doctor?.email || `ID: ${row.original.doctorId}`}
                  profilePhoto={doctor?.profilePhoto}
                />
              </div>
            )
          }
        }),
        columnHelper.accessor('scheduleId', {
          id: 'scheduleId',
          header: 'Schedule ID',
          enableSorting: true,
          cell: ({ getValue }) => (
            <span
              className='max-w-[120px] truncate font-mono text-xs text-muted-foreground'
              title={getValue()}>
              {getValue()}
            </span>
          )
        }),
        columnHelper.accessor(
          (row) => row.schedule?.startDateTime,
          {
            id: 'schedule.startDateTime',
            header: 'Schedule Time',
            enableSorting: true,
            cell: ({ row }) => {
              const schedule = row.original.schedule
              if (!schedule?.startDateTime) {
                return (
                  <span className='text-xs text-muted-foreground'>
                    No schedule assigned
                  </span>
                )
              }

              const formattedDate = formatScheduleDate(schedule.startDateTime)
              const formattedTime = formatScheduleTime(
                schedule.startDateTime,
                schedule.endDateTime
              )
              const duration = getScheduleDuration(
                schedule.startDateTime,
                schedule.endDateTime
              )

              return (
                <div className='flex flex-col gap-1'>
                  <div className='flex items-center gap-1.5 text-sm font-medium text-foreground'>
                    <CalendarClock className='h-3.5 w-3.5 text-primary' />
                    <span>{formattedDate}</span>
                  </div>
                  {formattedTime && (
                    <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                      <Clock className='h-3 w-3' />
                      <span>{formattedTime}</span>
                      {duration && (
                        <Badge
                          variant='outline'
                          className='h-4 px-1.5 text-[10px]'>
                          {duration}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              )
            }
          }
        ),
        columnHelper.accessor('isBooked', {
          id: 'isBooked',
          header: 'Status',
          enableSorting: true,
          cell: ({ getValue }) => {
            const isBooked = getValue()
            return (
              <Badge
                variant={isBooked ? 'destructive' : 'secondary'}
                className={
                  !isBooked
                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300'
                    : ''
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
          header: 'Created At',
          enableSorting: true,
          cell: ({ getValue }) => (
            <DateCell
              date={getValue()}
              formatString='MMM dd, yyyy'
            />
          )
        }),
        columnHelper.accessor('updatedAt', {
          id: 'updatedAt',
          header: 'Updated At',
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
          <p className='mb-1 text-xs font-bold uppercase text-primary'>
            Schedule Management
          </p>
          <h1 className='text-2xl font-extrabold text-foreground'>
            Doctor Schedules
          </h1>
          <p className='mt-1 text-sm text-muted-foreground'>
            Browse and manage doctor schedule assignments and booking status.
          </p>
        </div>
        <div className='rounded-md border border-border bg-card px-3 py-2 text-sm text-muted-foreground'>
          <span className='font-semibold tabular-nums text-foreground'>
            {meta?.total ?? doctorSchedules.length}
          </span>{' '}
          {meta?.total === 1 || doctorSchedules.length === 1
            ? 'schedule'
            : 'schedules'}
        </div>
      </header>

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
          placeholder: 'Search by ID, Doctor ID, or Schedule ID...',
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
      />
    </section>
  )
}

export default DoctorSchedulesTable
