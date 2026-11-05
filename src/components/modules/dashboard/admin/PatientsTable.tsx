'use client'

import ChangeUserStatusDialog from '@/components/shared/ChangeUserStatusDialog'
import DataTable from '@/components/shared/DataTable'
import {
  DataTableFilterConfig,
  DataTableFilterValues
} from '@/components/shared/DataTableFilters'
import DateCell from '@/components/modules/dashboard/DateCell'
import StatusBadgeCell from '@/components/modules/dashboard/StatusBadgeCell'
import UserInfoCell from '@/components/modules/dashboard/UserInfoCell'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { useRowActionModalState } from '@/hooks/useRowActionModalState'
import { useServerManagedDataTable } from '@/hooks/useServerManagedDataTable'
import {
  serverManagedFilter,
  useServerManagedDataTableFilters
} from '@/hooks/useServerManagedDataTableFilters'
import { useServerManagedDataTableSearch } from '@/hooks/useServerManagedDataTableSearch'
import {
  deletePatient,
  getPatients,
  updatePatientStatus
} from '@/service/patient.service'
import { IPatient } from '@/types/patient.types'
import { UserStatus } from '@/types/user.types'
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query'
import { createColumnHelper, tableFeatures } from '@tanstack/react-table'
import { RotateCcw } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

const PatientsTable = () => {
  type TableFeatures = ReturnType<typeof tableFeatures>
  const columnHelper = createColumnHelper<TableFeatures, IPatient>()
  const queryClient = useQueryClient()
  const searchParams = useSearchParams()
  const [statusTarget, setStatusTarget] = useState<IPatient | null>(null)
  const [statusValue, setStatusValue] = useState<UserStatus>(UserStatus.ACTIVE)

  const patientFilterDefinitions = [
    serverManagedFilter.single('user.status'),
    serverManagedFilter.single('isDeleted')
  ]

  const columns = columnHelper.columns([
    columnHelper.accessor('name', {
      header: 'Name',
      cell: ({ row }) => (
        <UserInfoCell
          name={row.original.name}
          email={row.original.email}
          profilePhoto={row.original.profilePhoto ?? undefined}
        />
      )
    }),
    columnHelper.accessor('contactNumber', {
      header: 'Contact Number',
      cell: ({ getValue }) => (
        <span className='text-sm'>{getValue() || 'N/A'}</span>
      )
    }),
    columnHelper.display({
      id: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadgeCell status={row.original.user.status} />
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

  const { deletingItem, isDeleteDialogOpen, onDeleteOpenChange, tableActions } =
    useRowActionModalState<IPatient>({ enableView: false, enableEdit: false })

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
    defaultPage: 1,
    defaultLimit: 10
  })

  const { searchTermFromUrl, handleDebouncedSearchChange } =
    useServerManagedDataTableSearch({ searchParams, updateParams })

  const { filterValues, handleFilterChange, clearAllFilters } =
    useServerManagedDataTableFilters({
      searchParams,
      definitions: patientFilterDefinitions,
      updateParams
    })

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ['patients', queryStringFromUrl] as const,
    queryFn: ({ queryKey: [, queryString] }) => getPatients(queryString),
    placeholderData: keepPreviousData
  })
  const responseData = data?.data
  const patients = responseData?.data ?? []
  const meta = responseData?.meta ?? data?.meta

  const refreshPatients = async () => {
    await queryClient.invalidateQueries({ queryKey: ['patients'] })
    await queryClient.refetchQueries({ queryKey: ['patients'], type: 'active' })
  }

  const statusMutation = useMutation({
    mutationFn: ({
      patient,
      status
    }: {
      patient: IPatient
      status: UserStatus
    }) => updatePatientStatus(String(patient.id), status),
    onSuccess: async (result) => {
      if (!result.success) {
        toast.error(result.message || 'Failed to change patient status')
        return
      }
      toast.success(result.message || 'Patient status updated')
      setStatusTarget(null)
      await refreshPatients()
    },
    onError: (mutationError) =>
      toast.error(
        mutationError instanceof Error
          ? mutationError.message
          : 'Failed to change patient status'
      )
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePatient(id),
    onSuccess: async (result) => {
      if (!result.success) {
        toast.error(result.message || 'Failed to delete patient')
        return
      }
      toast.success(result.message || 'Patient deleted successfully')
      onDeleteOpenChange(false)
      await refreshPatients()
    },
    onError: (mutationError) =>
      toast.error(
        mutationError instanceof Error
          ? mutationError.message
          : 'Failed to delete patient'
      )
  })

  const actions = useMemo(
    () => ({
      ...tableActions,
      onStatusChange: (patient: IPatient) => {
        setStatusTarget(patient)
        setStatusValue(patient.user.status)
      }
    }),
    [setStatusTarget, setStatusValue, tableActions]
  )

  const fetchError = isError
    ? error instanceof Error
      ? error.message
      : 'Unable to load patients.'
    : data?.success === false
      ? data.message
      : responseData?.success === false
        ? responseData.message
        : undefined

  const filterConfigs = useMemo<DataTableFilterConfig[]>(
    () => [
      {
        id: 'user.status',
        label: 'Status',
        type: 'single-select',
        options: [
          { label: 'Active', value: UserStatus.ACTIVE },
          { label: 'Blocked', value: UserStatus.BLOCK },
          { label: 'Deleted', value: UserStatus.DELETED }
        ]
      },
      {
        id: 'isDeleted',
        label: 'Deleted profile',
        type: 'single-select',
        options: [
          { label: 'Yes', value: 'true' },
          { label: 'No', value: 'false' }
        ]
      }
    ],
    []
  )

  const filterValuesForTable = useMemo<DataTableFilterValues>(
    () => ({
      'user.status': filterValues['user.status'],
      isDeleted: filterValues.isDeleted
    }),
    [filterValues]
  )

  const hasActiveFilters = Boolean(
    filterValues['user.status'] || filterValues.isDeleted
  )

  return (
    <>
      <section className='mx-auto w-full max-w-[1600px] space-y-5 px-4 py-5 md:px-8 md:py-7'>
        <header className='flex flex-wrap items-end justify-between gap-4'>
          <div>
            <p className='mb-1 text-xs font-bold uppercase text-primary'>
              Patient directory
            </p>
            <h1 className='text-2xl font-extrabold text-foreground'>
              Patients
            </h1>
            <p className='mt-1 text-sm text-muted-foreground'>
              Browse and manage patient accounts.
            </p>
          </div>
          <div className='rounded-md border border-border bg-card px-3 py-2 text-sm text-muted-foreground'>
            <span className='font-semibold tabular-nums text-foreground'>
              {patients.length}
            </span>{' '}
            {patients.length === 1 ? 'patient' : 'patients'}
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
          data={patients}
          columns={columns}
          isLoading={isLoading}
          isFetching={isFetching}
          isUpdating={isRouteRefreshPending}
          error={fetchError}
          onRetry={() => void refetch()}
          emptyMessage={
            searchTermFromUrl || hasActiveFilters
              ? 'No patients match these search criteria.'
              : 'No patient accounts are available yet.'
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
            placeholder: 'Search by patient name or email',
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
          actions={actions}
        />
      </section>

      <ChangeUserStatusDialog
        open={statusTarget !== null}
        onOpenChange={(open) => {
          if (!open) setStatusTarget(null)
        }}
        userName={statusTarget?.name}
        status={statusValue}
        onStatusChange={setStatusValue}
        onSubmit={() => {
          if (statusTarget) {
            statusMutation.mutate({
              patient: statusTarget,
              status: statusValue
            })
          }
        }}
        isPending={statusMutation.isPending}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={onDeleteOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Patient</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{' '}
              {deletingItem?.name ?? 'this patient'}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant='destructive'
              disabled={!deletingItem || deleteMutation.isPending}
              onClick={(event) => {
                event.preventDefault()
                if (deletingItem) deleteMutation.mutate(String(deletingItem.id))
              }}>
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default PatientsTable
