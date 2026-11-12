'use client'

import ChangeAppointmentStatusDialog from '@/components/modules/dashboard/admin/ChangeAppointmentStatusDialog'
import DateCell from '@/components/modules/dashboard/DateCell'
import UserInfoCell from '@/components/modules/dashboard/UserInfoCell'
import ViewAppointmentModal from '@/components/modules/dashboard/doctor/ViewAppointmentModal'
import DataTable from '@/components/shared/DataTable'
import {
  DataTableFilterConfig,
  DataTableFilterValues
} from '@/components/shared/DataTableFilters'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/app/lib/utils'
import { useServerManagedDataTable } from '@/hooks/useServerManagedDataTable'
import {
  serverManagedFilter,
  useServerManagedDataTableFilters
} from '@/hooks/useServerManagedDataTableFilters'
import { useServerManagedDataTableSearch } from '@/hooks/useServerManagedDataTableSearch'
import {
  changeAppointmentStatus,
  getMyAppointments
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
import { Clock, RotateCcw, Video } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10

const DOCTOR_APPOINTMENT_FILTER_DEFINITIONS = [
  serverManagedFilter.single('status'),
  serverManagedFilter.single('paymentStatus')
]

const DoctorAppointmentsTable = () => {
  type TableFeatures = ReturnType<typeof tableFeatures>
  const columnHelper = createColumnHelper<TableFeatures, IAppointment>()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()

  // State for Change Status Dialog
  const [statusTarget, setStatusTarget] = useState<IAppointment | null>(null)
  const [statusValue, setStatusValue] = useState<AppointmentStatus>(
    AppointmentStatus.SCHEDULED
  )

  // State for View Details Modal
  const [viewingAppointment, setViewingAppointment] =
    useState<IAppointment | null>(null)

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

  // Fetch appointments for this doctor
  const {
    data: appointmentDataResponse,
    isLoading,
    isFetching,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['my-appointments', queryString] as const,
    queryFn: ({ queryKey: [, query] }) => getMyAppointments(query),
    placeholderData: keepPreviousData
  })

  // Mutation to change status
  const { mutate: performStatusChange, isPending: isUpdatingStatus } =
    useMutation({
      mutationFn: async () => {
        if (!statusTarget?.id) {
          throw new Error('Appointment identifier is missing.')
        }
        return changeAppointmentStatus(statusTarget.id, statusValue)
      },
      onSuccess: () => {
        toast.success('Appointment status updated successfully.')
        setStatusTarget(null)
        void queryClient.invalidateQueries({
          queryKey: ['my-appointments']
        })
      },
      onError: (err) => {
        toast.error(
          err instanceof Error
            ? err.message
            : 'Failed to change appointment status.'
        )
      }
    })

  const appointmentResponseData = appointmentDataResponse?.data
  const appointments: IAppointment[] = useMemo(() => {
    if (!appointmentResponseData) return []
    if (Array.isArray(appointmentResponseData)) return appointmentResponseData
    if (
      'data' in appointmentResponseData &&
      Array.isArray(
        (appointmentResponseData as unknown as { data: IAppointment[] }).data
      )
    ) {
      return (appointmentResponseData as unknown as { data: IAppointment[] })
        .data
    }
    return []
  }, [appointmentResponseData])

  const meta: PaginationMeta | undefined =
    appointmentDataResponse?.meta ??
    (appointmentResponseData && 'meta' in appointmentResponseData
      ? (appointmentResponseData as unknown as { meta: PaginationMeta }).meta
      : undefined)

  const { filterValues, handleFilterChange, clearAllFilters } =
    useServerManagedDataTableFilters({
      searchParams,
      definitions: DOCTOR_APPOINTMENT_FILTER_DEFINITIONS,
      updateParams
    })

  const filterConfigs = useMemo<DataTableFilterConfig[]>(() => {
    return [
      {
        id: 'status',
        label: 'Appointment Status',
        type: 'single-select',
        options: [
          { label: 'Scheduled', value: AppointmentStatus.SCHEDULED },
          { label: 'In Progress', value: AppointmentStatus.INPROGRESS },
          { label: 'Completed', value: AppointmentStatus.COMPLETED },
          { label: 'Canceled', value: AppointmentStatus.CANCELED }
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

  const hasActiveFilters = Boolean(
    filterValues.status || filterValues.paymentStatus
  )

  const emptyMessage =
    searchTermFromUrl || hasActiveFilters
      ? 'No appointments match these criteria.'
      : 'You have no appointments booked yet.'

  const fetchError = isError
    ? error instanceof Error
      ? error.message
      : 'Unable to load appointments.'
    : appointmentDataResponse?.success === false
      ? appointmentDataResponse.message
      : undefined

  const columns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor('patient', {
          id: 'patient',
          header: 'Patient',
          enableSorting: false,
          cell: ({ row }) => {
            const patient = row.original.patient
            return (
              <UserInfoCell
                name={patient?.name || 'Unnamed Patient'}
                email={patient?.email || 'N/A'}
                profilePhoto={patient?.profilePhoto || undefined}
              />
            )
          }
        }),
        columnHelper.display({
          id: 'schedule',
          header: 'Appointment Time',
          cell: ({ row }) => {
            const schedule =
              row.original.schedule || row.original.doctorSchedule?.schedule

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
                    ? ` — ${endDate.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}`
                    : ''
                }`

            return (
              <div className='flex flex-col gap-0.5'>
                <span className='text-sm font-semibold text-foreground'>
                  {formattedDate}
                </span>
                {formattedTime && (
                  <span className='flex items-center gap-1 text-xs text-muted-foreground'>
                    <Clock className='size-3' /> {formattedTime}
                  </span>
                )}
              </div>
            )
          }
        }),
        columnHelper.accessor('status', {
          id: 'status',
          header: 'Status',
          enableSorting: true,
          cell: ({ getValue }) => {
            const status = getValue()
            const normalized = status?.toUpperCase()

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
              <Badge variant={getVariant(normalized)}>
                <span className='text-xs font-medium capitalize'>
                  {status?.toLowerCase() || 'unknown'}
                </span>
              </Badge>
            )
          }
        }),
        columnHelper.accessor('paymentStatus', {
          id: 'paymentStatus',
          header: 'Payment Status',
          enableSorting: true,
          cell: ({ getValue }) => {
            const paymentStatus = getValue()
            const isPaid = paymentStatus?.toUpperCase() === 'PAID'

            return (
              <Badge
                variant={isPaid ? 'default' : 'destructive'}
                className={
                  isPaid
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                    : ''
                }>
                <span className='text-xs font-semibold uppercase'>
                  {paymentStatus || 'UNPAID'}
                </span>
              </Badge>
            )
          }
        }),
        columnHelper.display({
          id: 'telemedicine',
          header: 'Telemedicine',
          cell: ({ row }) => {
            const videoCallingId = row.original.videoCallingId
            if (!videoCallingId) {
              return (
                <span className='text-xs text-muted-foreground'>In-Person</span>
              )
            }

            return (
              <a
                href={`/video-call/${videoCallingId}`}
                target='_blank'
                rel='noopener noreferrer'
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'sm' }),
                  'h-7 gap-1 px-2 text-xs'
                )}>
                <Video className='size-3 text-primary' /> Video Room
              </a>
            )
          }
        }),
        columnHelper.accessor('createdAt', {
          id: 'createdAt',
          header: 'Booked On',
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

  const tableActions = useMemo(
    () => ({
      onView: (appointment: IAppointment) => {
        setViewingAppointment(appointment)
      },
      onStatusChange: (appointment: IAppointment) => {
        setStatusTarget(appointment)
        setStatusValue(
          (appointment.status?.toUpperCase() as AppointmentStatus) ||
            AppointmentStatus.SCHEDULED
        )
      }
    }),
    []
  )

  return (
    <section className='mx-auto w-full max-w-[1600px] space-y-5 px-4 py-5 md:px-8 md:py-7'>
      <header className='flex flex-wrap items-end justify-between gap-4'>
        <div>
          <p className='mb-1 text-xs font-bold uppercase tracking-wider text-primary'>
            Appointments
          </p>
          <h1 className='text-2xl font-extrabold text-foreground'>
            Patient Appointments
          </h1>
          <p className='mt-1 text-sm text-muted-foreground'>
            Manage your patient consultation bookings, attendance, and statuses.
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <div className='rounded-md border border-border bg-card px-3 py-2 text-sm text-muted-foreground shadow-2xs'>
            <span className='font-semibold tabular-nums text-foreground'>
              {meta?.total ?? appointments.length}
            </span>{' '}
            {meta?.total === 1 || appointments.length === 1
              ? 'appointment'
              : 'appointments'}
          </div>
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
        data={appointments}
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
          placeholder: 'Search patient name, email, or ID...',
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

      {/* Change Status Modal Dialog */}
      <ChangeAppointmentStatusDialog
        open={Boolean(statusTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setStatusTarget(null)
          }
        }}
        patientName={statusTarget?.patient?.name}
        doctorName={statusTarget?.doctor?.name}
        status={statusValue}
        onStatusChange={setStatusValue}
        onSubmit={performStatusChange}
        isPending={isUpdatingStatus}
      />

      {/* View Appointment Details Modal */}
      <ViewAppointmentModal
        open={Boolean(viewingAppointment)}
        onOpenChange={(open) => {
          if (!open) {
            setViewingAppointment(null)
          }
        }}
        appointment={viewingAppointment}
        onOpenStatusDialog={() => {
          if (viewingAppointment) {
            setStatusTarget(viewingAppointment)
            setStatusValue(
              (viewingAppointment.status?.toUpperCase() as AppointmentStatus) ||
                AppointmentStatus.SCHEDULED
            )
          }
        }}
      />
    </section>
  )
}

export default DoctorAppointmentsTable
