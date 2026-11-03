'use client'

import DeleteDoctorConfirmationDialog from '@/components/modules/dashboard/admin/DeleteDoctorConfirmationDialog'
import EditDoctorFormModal from '@/components/modules/dashboard/admin/EditDoctorFormModal'
import DateCell from '@/components/modules/dashboard/DateCell'
import StatusBadgeCell from '@/components/modules/dashboard/StatusBadgeCell'
import UserInfoCell from '@/components/modules/dashboard/UserInfoCell'
import CreateDoctorFormModal from '@/components/shared/CreateDoctorFormModal'
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
import { getAllSpecialties, getDoctors } from '@/service/doctor.service'
import { PaginationMeta } from '@/types/api.types'
import { IDoctor } from '@/types/doctor.types'
import { ISpecialty } from '@/types/specialty.types'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { createColumnHelper, tableFeatures } from '@tanstack/react-table'
import { RotateCcw, Star } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10
const SPECIALTIES_FILTER_KEY = 'doctorSpecialties.specialty.title'
const APPOINTMENT_FEE_FILTER_KEY = 'appointmentFee'
const DOCTOR_FILTER_DEFINITIONS = [
  serverManagedFilter.single('gender'),
  serverManagedFilter.multi(SPECIALTIES_FILTER_KEY),
  serverManagedFilter.range(APPOINTMENT_FEE_FILTER_KEY)
]

const DoctorsTable = () => {
  type TableFeatures = ReturnType<typeof tableFeatures>
  const columnHelper = createColumnHelper<TableFeatures, IDoctor>()
  const searchParams = useSearchParams()
  const router = useRouter()

  const doctorColumns = columnHelper.columns([
    columnHelper.accessor('name', {
      header: 'name',
      cell: ({ row }) => (
        <UserInfoCell
          name={row.original.name}
          email={row.original.email}
          profilePhoto={row.original.profilePhoto}
        />
      )
    }),
    columnHelper.accessor('doctorSpecialties', {
      header: 'Specialties',
      cell: ({ row }) => {
        const specialties = row.original?.doctorSpecialties
        if (!specialties?.length) {
          return (
            <span className='text-xs text-muted-foreground'>
              No Specialties
            </span>
          )
        }

        return (
          <div className='flex flex-wrap gap-1'>
            {specialties.map(({ specialty }, index) => (
              <Badge
                key={specialty.id ?? index}
                variant='secondary'>
                {specialty?.title || 'N/A'}
              </Badge>
            ))}
          </div>
        )
      }
    }),
    columnHelper.accessor('contactNumber', {
      header: 'Contact Number',
      cell: ({ getValue }) => (
        <span className='text-sm'>{getValue() || 'N/A'}</span>
      )
    }),
    columnHelper.accessor('experience', {
      header: 'Experience',
      cell: ({ getValue }) => (
        <span className='text-sm font-medium'>{getValue() ?? 0} years</span>
      )
    }),
    columnHelper.accessor('appointmentFee', {
      header: 'Fee',
      cell: ({ getValue }) => {
        const fee = getValue()

        return (
          <span className='text-sm font-semibold text-green-600'>
            {fee != null ? `$${fee.toFixed(2)}` : 'N/A'}
          </span>
        )
      }
    }),
    columnHelper.accessor('averageRating', {
      header: 'Rating',
      cell: ({ getValue }) => (
        <div className='flex items-center gap-1'>
          <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
          <span className='text-sm font-medium'>
            {getValue()?.toFixed(1) ?? '0.0'}
          </span>
        </div>
      )
    }),
    columnHelper.accessor('gender', {
      header: 'Gender',
      cell: ({ getValue }) => (
        <span className='text-sm capitalize'>
          {getValue()?.toLowerCase() ?? 'N/A'}
        </span>
      )
    }),
    columnHelper.accessor((row) => row.user?.status, {
      id: 'status',
      header: 'Status',
      cell: ({ getValue }) => <StatusBadgeCell status={getValue()} />
    }),
    columnHelper.accessor('createdAt', {
      header: 'Joined On',
      cell: ({ getValue }) => (
        <DateCell
          date={getValue()}
          formatString='MMM dd, yyyy'
        />
      )
    })
  ])

  const {
    data: specialtiesResponse,
    isLoading: isLoadingSpecialties,
    isFetching: isFetchingSpecialties,
    isError: isSpecialtiesError,
    error: specialtiesError,
    refetch: refetchSpecialties
  } = useQuery({
    queryKey: ['specialties'],
    queryFn: getAllSpecialties,
    staleTime: 1000 * 60 * 60 * 6,
    gcTime: 1000 * 60 * 60 * 24
  })
  const specialties = useMemo<ISpecialty[]>(() => {
    return specialtiesResponse?.data ?? []
  }, [specialtiesResponse])

  const {
    editingItem,
    deletingItem,
    isEditModalOpen,
    isDeleteDialogOpen,
    onEditOpenChange,
    onDeleteOpenChange,
    tableActions
  } = useRowActionModalState<IDoctor>({ enableView: false })
  const doctorTableActions = useMemo(
    () => ({
      ...tableActions,
      onView: (doctor: IDoctor) =>
        router.push(`/admin/dashboard/doctors-management/${doctor.id}`)
    }),
    [router, tableActions]
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
    data: doctorDataResponse,
    isLoading,
    isFetching,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['doctors', queryString] as const,
    queryFn: ({ queryKey: [, queryString] }) => getDoctors(queryString),
    placeholderData: keepPreviousData
  })
  const doctorResponseData = doctorDataResponse?.data
  const doctors = doctorResponseData?.data ?? []
  const meta: PaginationMeta | undefined =
    doctorResponseData?.meta ?? doctorDataResponse?.meta

  const { filterValues, handleFilterChange, clearAllFilters } =
    useServerManagedDataTableFilters({
      searchParams,
      definitions: DOCTOR_FILTER_DEFINITIONS,
      updateParams
    })

  const filterConfigs = useMemo<DataTableFilterConfig[]>(() => {
    return [
      {
        id: 'gender',
        label: 'Gender',
        type: 'single-select',
        options: [
          { label: 'Male', value: 'MALE' },
          { label: 'Female', value: 'FEMALE' },
          { label: 'Other', value: 'OTHER' }
        ]
      },
      {
        id: SPECIALTIES_FILTER_KEY,
        label: 'Specialties',
        type: 'multi-select',
        options: specialties.map((specialty) => ({
          label: specialty.title,
          value: specialty.title
        }))
      },
      {
        id: 'appointmentFee',
        label: 'Fee Range',
        type: 'range'
      }
    ]
  }, [specialties])

  const filterValuesForTable = useMemo<DataTableFilterValues>(() => {
    return {
      gender: filterValues.gender,
      [SPECIALTIES_FILTER_KEY]: filterValues[SPECIALTIES_FILTER_KEY],
      appointmentFee: filterValues[APPOINTMENT_FEE_FILTER_KEY]
    }
  }, [filterValues])

  const { searchTermFromUrl, handleDebouncedSearchChange } =
    useServerManagedDataTableSearch({
      searchParams,
      updateParams
    })

  const hasActiveFilters =
    Boolean(filterValues.gender) ||
    (Array.isArray(filterValues[SPECIALTIES_FILTER_KEY]) &&
      filterValues[SPECIALTIES_FILTER_KEY].length > 0) ||
    (typeof filterValues[APPOINTMENT_FEE_FILTER_KEY] === 'object' &&
      filterValues[APPOINTMENT_FEE_FILTER_KEY] !== null &&
      Object.values(filterValues[APPOINTMENT_FEE_FILTER_KEY]).some(Boolean))
  const emptyMessage =
    searchTermFromUrl || hasActiveFilters
      ? 'No doctors match these search criteria.'
      : 'No doctor profiles are available yet.'
  const doctorFetchError = isError
    ? error instanceof Error
      ? error.message
      : 'Unable to load doctors.'
    : doctorDataResponse?.success === false
      ? doctorDataResponse.message
      : doctorResponseData?.success === false
        ? doctorResponseData.message
        : undefined
  const specialtyFetchError = isSpecialtiesError
    ? specialtiesError instanceof Error
      ? specialtiesError.message
      : 'Unable to load specialties.'
    : specialtiesResponse?.success === false
      ? specialtiesResponse.message
      : undefined

  return (
    <>
      <section className='mx-auto w-full max-w-[1600px] space-y-5 px-4 py-5 md:px-8 md:py-7'>
        <header className='flex flex-wrap items-end justify-between gap-4'>
          <div>
            <p className='mb-1 text-xs font-bold uppercase text-primary'>
              Clinical directory
            </p>
            <h1 className='text-2xl font-extrabold text-foreground'>Doctors</h1>
            <p className='mt-1 text-sm text-muted-foreground'>
              Browse and manage practitioner profiles.
            </p>
          </div>
          <div className='rounded-md border border-border bg-card px-3 py-2 text-sm text-muted-foreground'>
            <span className='font-semibold tabular-nums text-foreground'>
              {meta?.total ?? doctors.length}
            </span>{' '}
            {meta?.total === 1 || doctors.length === 1 ? 'doctor' : 'doctors'}
          </div>
        </header>

        {specialtyFetchError && (
          <div
            className='flex flex-wrap items-center justify-between gap-3 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm'
            role='alert'>
            <p className='text-muted-foreground'>
              Specialty options could not be loaded. Specialty filters and
              doctor forms may be incomplete. {specialtyFetchError}
            </p>
            <Button
              type='button'
              size='sm'
              variant='outline'
              onClick={() => void refetchSpecialties()}
              disabled={isFetchingSpecialties}>
              <RotateCcw className='h-3.5 w-3.5' />
              Retry
            </Button>
          </div>
        )}

        <DataTable
          data={doctors}
          columns={doctorColumns}
          isLoading={isLoading}
          isFetching={isFetching}
          isUpdating={isRouteRefreshPending}
          error={doctorFetchError}
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
            placeholder: 'Search by doctor name or email',
            debounceMs: 500,
            onDebouncedChange: handleDebouncedSearchChange
          }}
          filters={{
            configs: filterConfigs,
            values: filterValuesForTable,
            onFilterChange: handleFilterChange,
            onClearAll: clearAllFilters
          }}
          toolbarAction={
            <CreateDoctorFormModal
              specialties={specialties}
              isLoadingSpecialties={isLoadingSpecialties}
            />
          }
          meta={meta}
          actions={doctorTableActions}
        />
      </section>
      <EditDoctorFormModal
        open={isEditModalOpen}
        onOpenChange={onEditOpenChange}
        doctor={editingItem}
        specialties={specialties}
        isLoadingSpecialties={isLoadingSpecialties}
      />

      <DeleteDoctorConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={onDeleteOpenChange}
        doctor={deletingItem}
      />

    </>
  )
}

export default DoctorsTable
