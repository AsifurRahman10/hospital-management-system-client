'use client'

import CreateScheduleFormModal from '@/components/modules/dashboard/admin/CreateScheduleFormModal'
import DeleteScheduleConfirmationDialog from '@/components/modules/dashboard/admin/DeleteScheduleConfirmationDialog'
import DateCell from '@/components/modules/dashboard/DateCell'
import DataTable from '@/components/shared/DataTable'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRowActionModalState } from '@/hooks/useRowActionModalState'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { useServerManagedDataTable } from '@/hooks/useServerManagedDataTable'
import { useServerManagedDataTableSearch } from '@/hooks/useServerManagedDataTableSearch'
import { getSchedules } from '@/service/schedule.service'
import { PaginationMeta } from '@/types/api.types'
import { ISchedule } from '@/types/schedule.types'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { createColumnHelper, tableFeatures } from '@tanstack/react-table'
import { RotateCcw } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import type { DateRange } from 'react-day-picker'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10
const getDurationLabel = (schedule: ISchedule) => {
  const start = new Date(schedule.startDateTime)
  const end = new Date(schedule.endDateTime)
  const duration = (end.getTime() - start.getTime()) / 60000

  return Number.isFinite(duration) && duration > 0 ? `${duration} mins` : 'N/A'
}

const formatDateTime = (value: string) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'N/A' : date.toLocaleString()
}

const toDate = (value: string | null) => {
  if (!value) return undefined
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date
}

const toIsoDateTime = (
  date: Date | undefined,
  timeStr: string,
  isEnd = false
) => {
  if (!date) return ''
  const [hours, minutes] = timeStr.split(':').map(Number)
  const d = new Date(date)
  d.setHours(
    Number.isFinite(hours) ? hours : isEnd ? 23 : 0,
    Number.isFinite(minutes) ? minutes : isEnd ? 59 : 0,
    isEnd ? 59 : 0,
    isEnd ? 999 : 0
  )
  return d.toISOString()
}

const getDateRangeLabel = (range: DateRange | undefined) => {
  if (!range?.from) return 'Filter by date range'
  const from = range.from.toLocaleDateString()
  const to = range.to?.toLocaleDateString()
  return to ? `${from} - ${to}` : from
}

const ScheduleDateRangeFilter = ({
  searchParams,
  updateParams
}: {
  searchParams: ReturnType<typeof useSearchParams>
  updateParams: ReturnType<typeof useServerManagedDataTable>['updateParams']
}) => {
  const initialFrom = toDate(
    searchParams.get('startDateTime[gte]') || searchParams.get('startDateTime')
  )
  const initialTo = toDate(
    searchParams.get('endDateTime[lte]') || searchParams.get('endDateTime')
  )
  const [open, setOpen] = useState(false)
  const [range, setRange] = useState<DateRange | undefined>({
    from: initialFrom,
    to: initialTo
  })
  const [startTime, setStartTime] = useState(
    initialFrom
      ? `${String(initialFrom.getHours()).padStart(2, '0')}:${String(initialFrom.getMinutes()).padStart(2, '0')}`
      : '00:00'
  )
  const [endTime, setEndTime] = useState(
    initialTo
      ? `${String(initialTo.getHours()).padStart(2, '0')}:${String(initialTo.getMinutes()).padStart(2, '0')}`
      : '23:59'
  )

  const applyRange = () => {
    updateParams(
      (params) => {
        params.delete('startDateTime')
        params.delete('endDateTime')
        params.delete('startDateTime[gte]')
        params.delete('endDateTime[lte]')

        if (range?.from) {
          params.set(
            'startDateTime[gte]',
            toIsoDateTime(range.from, startTime, false)
          )
        }
        if (range?.to) {
          params.set('endDateTime[lte]', toIsoDateTime(range.to, endTime, true))
        }
      },
      { resetPage: true }
    )
    setOpen(false)
  }

  const clearRange = () => {
    setRange(undefined)
    setStartTime('00:00')
    setEndTime('23:59')
    updateParams(
      (params) => {
        params.delete('startDateTime')
        params.delete('endDateTime')
        params.delete('startDateTime[gte]')
        params.delete('endDateTime[lte]')
      },
      { resetPage: true }
    )
    setOpen(false)
  }

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type='button'
            variant={range?.from ? 'outline' : 'default'}
            className='h-9 justify-start font-normal'>
            {getDateRangeLabel(range)}
          </Button>
        }
      />
      <PopoverContent
        align='start'
        className='w-auto min-w-88 p-0'>
        <div className='border-b px-4 py-3'>
          <p className='font-semibold'>Schedule date range</p>
          <p className='text-xs text-muted-foreground'>
            Choose the first and last schedule time.
          </p>
        </div>
        <Calendar
          mode='range'
          required={false}
          selected={range}
          onSelect={setRange}
          numberOfMonths={2}
          className='mx-auto'
        />
        <div className='grid grid-cols-2 gap-3 border-t px-4 py-3'>
          <label className='space-y-1 text-xs font-medium'>
            Start time
            <Input
              type='time'
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
            />
          </label>
          <label className='space-y-1 text-xs font-medium'>
            End time
            <Input
              type='time'
              value={endTime}
              onChange={(event) => setEndTime(event.target.value)}
            />
          </label>
        </div>
        <div className='flex justify-between gap-2 border-t px-4 py-3'>
          <Button
            type='button'
            variant='ghost'
            onClick={clearRange}>
            Clear
          </Button>
          <Button
            type='button'
            onClick={applyRange}
            disabled={!range?.from}>
            Apply range
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

const SchedulesTable = () => {
  type TableFeatures = ReturnType<typeof tableFeatures>
  const columnHelper = createColumnHelper<TableFeatures, ISchedule>()
  const searchParams = useSearchParams()
  const { deletingItem, isDeleteDialogOpen, onDeleteOpenChange, tableActions } =
    useRowActionModalState<ISchedule>({
      enableView: false,
      enableEdit: false
    })

  const columns = columnHelper.columns([
    columnHelper.accessor('startDateTime', {
      header: 'Start',
      cell: ({ getValue }) => (
        <span className='text-sm'>{formatDateTime(getValue())}</span>
      )
    }),
    columnHelper.accessor('endDateTime', {
      header: 'End',
      cell: ({ getValue }) => (
        <span className='text-sm'>{formatDateTime(getValue())}</span>
      )
    }),
    columnHelper.accessor((row) => getDurationLabel(row), {
      id: 'duration',
      header: 'Duration',
      cell: ({ getValue }) => <span className='text-sm'>{getValue()}</span>
    }),
    columnHelper.accessor('doctorSchedules', {
      header: 'Doctor Slots',
      enableSorting: false,
      cell: ({ getValue }) => (
        <span className='text-sm'>{getValue()?.length ?? 0}</span>
      )
    }),
    columnHelper.accessor(
      (row) => row.doctorSchedules?.filter((item) => item.isBooked).length ?? 0,
      {
        id: 'bookedCount',
        enableSorting: false,
        header: 'Booked',
        cell: ({ getValue }) => <span className='text-sm'>{getValue()}</span>
      }
    ),
    columnHelper.accessor('appointments', {
      header: 'Appointments',
      enableSorting: false,
      cell: ({ getValue }) => (
        <span className='text-sm'>{getValue()?.length ?? 0}</span>
      )
    }),
    columnHelper.accessor('createdAt', {
      header: 'Created',
      cell: ({ getValue }) => (
        <DateCell
          date={getValue()}
          formatString='MMM dd, yyyy'
        />
      )
    })
  ])

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

  const { searchTermFromUrl, handleDebouncedSearchChange } =
    useServerManagedDataTableSearch({ searchParams, updateParams })

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ['schedules', queryStringFromUrl] as const,
    queryFn: ({ queryKey: [, queryString] }) => getSchedules(queryString),
    placeholderData: keepPreviousData
  })

  const responseData = data?.data
  const schedules = responseData?.data ?? []
  const meta: PaginationMeta | undefined = responseData?.meta ?? data?.meta

  const fetchError = isError
    ? error instanceof Error
      ? error.message
      : 'Unable to load schedules.'
    : data?.success === false
      ? data.message
      : responseData?.success === false
        ? responseData.message
        : undefined

  return (
    <section className='mx-auto w-full max-w-[1600px] space-y-5 px-4 py-5 md:px-8 md:py-7'>
      <header className='flex flex-wrap items-end justify-between gap-4'>
        <div>
          <p className='mb-1 text-xs font-bold uppercase text-primary'>
            Operations
          </p>
          <h1 className='text-2xl font-extrabold text-foreground'>Schedules</h1>
          <p className='mt-1 text-sm text-muted-foreground'>
            Browse schedules and their booking activity.
          </p>
        </div>
        <div className='rounded-md border border-border bg-card px-3 py-2 text-sm text-muted-foreground'>
          <span className='font-semibold tabular-nums text-foreground'>
            {meta?.total ?? schedules.length}
          </span>{' '}
          {meta?.total === 1 || schedules.length === 1
            ? 'schedule'
            : 'schedules'}
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
            <RotateCcw className='h-3.5 w-3.5' /> Retry
          </Button>
        </div>
      )}

      <DataTable
        data={schedules}
        columns={columns}
        isLoading={isLoading}
        isFetching={isFetching}
        isUpdating={isRouteRefreshPending}
        error={fetchError}
        onRetry={() => void refetch()}
        emptyMessage={
          searchTermFromUrl
            ? 'No schedules match this search.'
            : 'No schedules are available yet.'
        }
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
          placeholder: 'Search by schedule date or ID',
          debounceMs: 500,
          onDebouncedChange: handleDebouncedSearchChange
        }}
        toolbarAction={
          <div className='flex flex-wrap justify-end items-center gap-2'>
            <ScheduleDateRangeFilter
              searchParams={searchParams}
              updateParams={updateParams}
            />
            <CreateScheduleFormModal />
          </div>
        }
        meta={meta}
        actions={tableActions}
      />
      <DeleteScheduleConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={onDeleteOpenChange}
        schedule={deletingItem}
      />
    </section>
  )
}

export default SchedulesTable
