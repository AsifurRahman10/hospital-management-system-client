'use client'

import ChangeAppointmentStatusDialog from '@/components/modules/dashboard/admin/ChangeAppointmentStatusDialog'
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
import {
  changeAppointmentStatus,
  getAppointments
} from '@/service/appointment.service'
import { PaginationMeta } from '@/types/api.types'
import { AppointmentStatus, IAppointment } from '@/types/appointment.type'
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query'
import { createColumnHelper, tableFeatures } from '@tanstack/react-table'
import { useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10
const APPOINTMENT_FILTER_DEFINITIONS = [
  serverManagedFilter.single('status'),
  serverManagedFilter.single('paymentStatus')
]

const AppointmentTable = () => {
  type TableFeatures = ReturnType<typeof tableFeatures>
  const columnHelper = createColumnHelper<TableFeatures, IAppointment>()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()

  const [statusTarget, setStatusTarget] = useState<IAppointment | null>(null)
  const [statusValue, setStatusValue] = useState<AppointmentStatus>(
    AppointmentStatus.SCHEDULED
  )

  const appointmentColumns = columnHelper.columns([
    columnHelper.accessor('patient', {
      header: 'Patient',
      cell: ({ row }) => (
        <UserInfoCell
          name={row.original.patient?.name ?? 'Unknown patient'}
          email={row.original.patient?.email ?? 'N/A'}
          profilePhoto={row.original.patient?.profilePhoto ?? undefined}
        />
      )
    }),
    columnHelper.accessor('doctor', {
      header: 'Doctor',
      cell: ({ row }) => (
        <UserInfoCell
          name={row.original.doctor?.name ?? 'Unknown doctor'}
          email={row.original.doctor?.email ?? 'N/A'}
          profilePhoto={row.original.doctor?.profilePhoto ?? undefined}
        />
      )
    }),
    columnHelper.display({
      id: 'schedule',
      header: 'Appointment Time',
      cell: ({ row }) => {
        const schedule =
          row.original.schedule ?? row.original.doctorSchedule?.schedule

        if (!schedule?.startDateTime) {
          return (
            <span className='text-xs text-muted-foreground'>
              No schedule assigned
            </span>
          )
        }

        const startDate = new Date(schedule.startDateTime)
        const endDate = schedule.endDateTime
          ? new Date(schedule.endDateTime)
          : null

        const formattedDate = Number.isNaN(startDate.getTime())
          ? 'N/A'
          : startDate.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })

        const formattedTime = Number.isNaN(startDate.getTime())
          ? ''
          : `${startDate.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            })}${
              endDate && !Number.isNaN(endDate.getTime())
                ? ` - ${endDate.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}`
                : ''
            }`

        return (
          <div className='flex flex-col gap-0.5'>
            <span className='text-sm font-medium text-foreground'>
              {formattedDate}
            </span>
            {formattedTime && (
              <span className='text-xs text-muted-foreground'>
                {formattedTime}
              </span>
            )}
          </div>
        )
      }
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: ({ getValue }) => {
        const status = getValue()
        const normalizedStatus = status?.toUpperCase()

        const getVariant = (val?: string) => {
          switch (val) {
            case 'COMPLETED':
              return 'default'
            case 'SCHEDULED':
              return 'secondary'
            case 'INPROGRESS':
              return 'outline'
            case 'CANCELED':
              return 'destructive'
            default:
              return 'secondary'
          }
        }

        return (
          <Badge variant={getVariant(normalizedStatus)}>
            <span className='text-xs font-medium capitalize'>
              {status?.toLowerCase() ?? 'unknown'}
            </span>
          </Badge>
        )
      }
    }),
    columnHelper.accessor('paymentStatus', {
      header: 'Payment Status',
      cell: ({ getValue }) => {
        const paymentStatus = getValue()
        const isPaid = paymentStatus?.toUpperCase() === 'PAID'

        return (
          <Badge variant={isPaid ? 'default' : 'destructive'}>
            <span className='text-xs font-medium capitalize'>
              {paymentStatus?.toLowerCase() ?? 'unpaid'}
            </span>
          </Badge>
        )
      }
    }),
    columnHelper.accessor('createdAt', {
      header: 'Booked On',
      cell: ({ getValue }) => (
        <DateCell
          date={getValue()}
          formatString='MMM dd, yyyy'
        />
      )
    })
  ])

  const statusMutation = useMutation({
    mutationFn: ({
      appointment,
      status
    }: {
      appointment: IAppointment
      status: AppointmentStatus
    }) => changeAppointmentStatus(appointment.id, status),
    onSuccess: async (result) => {
      if (!result.success) {
        toast.error(result.message || 'Failed to change appointment status')
        return
      }

      toast.success(result.message || 'Appointment status updated')
      setStatusTarget(null)
      await queryClient.invalidateQueries({ queryKey: ['appointments'] })
      await queryClient.refetchQueries({
        queryKey: ['appointments'],
        type: 'active'
      })
    },
    onError: (mutationError) =>
      toast.error(
        mutationError instanceof Error
          ? mutationError.message
          : 'Failed to change appointment status'
      )
  })

  const appointmentTableActions = useMemo(
    () => ({
      onStatusChange: (appointment: IAppointment) => {
        setStatusTarget(appointment)
        setStatusValue(
          (appointment.status?.toUpperCase() as AppointmentStatus) ||
            AppointmentStatus.SCHEDULED
        )
      }
    }),
    [setStatusTarget, setStatusValue]
  )

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

  const {
    data: appointmentDataResponse,
    isLoading,
    isFetching,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['appointments', queryString] as const,
    queryFn: ({ queryKey: [, queryString] }) => getAppointments(queryString),
    placeholderData: keepPreviousData
  })

  const appointmentResponseData = appointmentDataResponse?.data
  const appointments =
    (Array.isArray(appointmentResponseData)
      ? appointmentResponseData
      : (
          appointmentResponseData as
            | { data?: IAppointment[]; meta?: PaginationMeta }
            | undefined
        )?.data) ?? []
  const meta: PaginationMeta | undefined =
    appointmentDataResponse?.meta ??
    (
      appointmentResponseData as
        | { data?: IAppointment[]; meta?: PaginationMeta }
        | undefined
    )?.meta

  const { filterValues, handleFilterChange, clearAllFilters } =
    useServerManagedDataTableFilters({
      searchParams,
      definitions: APPOINTMENT_FILTER_DEFINITIONS,
      updateParams
    })

  const filterConfigs = useMemo<DataTableFilterConfig[]>(() => {
    return [
      {
        id: 'status',
        label: 'Status',
        type: 'single-select',
        options: [
          { label: 'Scheduled', value: 'SCHEDULED' },
          { label: 'In Progress', value: 'INPROGRESS' },
          { label: 'Completed', value: 'COMPLETED' },
          { label: 'Canceled', value: 'CANCELED' }
        ]
      },
      {
        id: 'paymentStatus',
        label: 'Payment Status',
        type: 'single-select',
        options: [
          { label: 'Paid', value: 'PAID' },
          { label: 'Unpaid', value: 'UNPAID' }
        ]
      }
    ]
  }, [])

  const filterValuesForTable = useMemo<DataTableFilterValues>(() => {
    return {
      status: filterValues.status,
      paymentStatus: filterValues.paymentStatus
    }
  }, [filterValues])

  const { searchTermFromUrl, handleDebouncedSearchChange } =
    useServerManagedDataTableSearch({
      searchParams,
      updateParams
    })

  const hasActiveFilters =
    Boolean(filterValues.status) || Boolean(filterValues.paymentStatus)

  const emptyMessage =
    searchTermFromUrl || hasActiveFilters
      ? 'No appointments match these search criteria.'
      : 'No appointments are available yet.'

  const appointmentFetchError = isError
    ? error instanceof Error
      ? error.message
      : 'Unable to load appointments.'
    : appointmentDataResponse?.success === false
      ? appointmentDataResponse.message
      : (
            appointmentResponseData as
              | { success?: boolean; message?: string }
              | undefined
          )?.success === false
        ? (
            appointmentResponseData as
              | { success?: boolean; message?: string }
              | undefined
          )?.message
        : undefined

  return (
    <>
      <section className='mx-auto w-full max-w-[1600px] space-y-5 px-4 py-5 md:px-8 md:py-7'>
        <header className='flex flex-wrap items-end justify-between gap-4'>
          <div>
            <p className='mb-1 text-xs font-bold uppercase text-primary'>
              Appointment directory
            </p>
            <h1 className='text-2xl font-extrabold text-foreground'>
              Appointments
            </h1>
            <p className='mt-1 text-sm text-muted-foreground'>
              Browse and manage patient appointments and consultation bookings.
            </p>
          </div>
          <div className='rounded-md border border-border bg-card px-3 py-2 text-sm text-muted-foreground'>
            <span className='font-semibold tabular-nums text-foreground'>
              {meta?.total ?? appointments.length}
            </span>{' '}
            {meta?.total === 1 || appointments.length === 1
              ? 'appointment'
              : 'appointments'}
          </div>
        </header>

        <DataTable
          data={appointments}
          columns={appointmentColumns}
          isLoading={isLoading}
          isFetching={isFetching}
          isUpdating={isRouteRefreshPending}
          error={appointmentFetchError}
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
            placeholder: 'Search appointments...',
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
          actions={appointmentTableActions}
        />
      </section>

      <ChangeAppointmentStatusDialog
        open={statusTarget !== null}
        onOpenChange={(open) => {
          if (!open) setStatusTarget(null)
        }}
        patientName={statusTarget?.patient?.name}
        doctorName={statusTarget?.doctor?.name}
        status={statusValue}
        onStatusChange={setStatusValue}
        onSubmit={() => {
          if (statusTarget) {
            statusMutation.mutate({
              appointment: statusTarget,
              status: statusValue
            })
          }
        }}
        isPending={statusMutation.isPending}
      />
    </>
  )
}

export default AppointmentTable
