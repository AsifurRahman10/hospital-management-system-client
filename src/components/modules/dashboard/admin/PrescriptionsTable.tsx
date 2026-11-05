'use client'

import DateCell from '@/components/modules/dashboard/DateCell'
import UserInfoCell from '@/components/modules/dashboard/UserInfoCell'
import DataTable from '@/components/shared/DataTable'
import { Button } from '@/components/ui/button'
import { useServerManagedDataTable } from '@/hooks/useServerManagedDataTable'
import { getPrescriptions } from '@/service/prescription.service'
import { PaginationMeta } from '@/types/api.types'
import { IPrescription } from '@/types/prescription.type'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { createColumnHelper, tableFeatures } from '@tanstack/react-table'
import { FileText, RotateCcw } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

const PrescriptionsTable = () => {
  type TableFeatures = ReturnType<typeof tableFeatures>
  const columnHelper = createColumnHelper<TableFeatures, IPrescription>()
  const searchParams = useSearchParams()

  const columns = columnHelper.columns([
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
    columnHelper.accessor('followUpDate', {
      header: 'Follow-Up Date',
      cell: ({ row }) =>
        row.original.followUpDate ? (
          <DateCell
            date={row.original.followUpDate}
            formatString='MMM dd, yyyy'
          />
        ) : (
          <span className='text-sm text-muted-foreground'>N/A</span>
        )
    }),
    columnHelper.accessor('instructions', {
      header: 'Instructions',
      cell: ({ getValue }) => {
        const text = getValue()
        return (
          <p
            className='max-w-[280px] truncate text-sm text-foreground'
            title={text}>
            {text || 'No instructions'}
          </p>
        )
      }
    }),
    columnHelper.accessor('pdfUrl', {
      header: 'Document',
      enableSorting: false,
      cell: ({ getValue }) => {
        const url = getValue()
        if (!url) {
          return <span className='text-xs text-muted-foreground'>No PDF</span>
        }

        return (
          <a
            href={url}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline'>
            <FileText className='size-3.5' />
            View PDF
          </a>
        )
      }
    }),
    columnHelper.accessor('createdAt', {
      header: 'Issued On',
      cell: ({ row }) =>
        row.original.createdAt ? (
          <DateCell
            date={row.original.createdAt}
            formatString='MMM dd, yyyy'
          />
        ) : (
          <span className='text-sm text-muted-foreground'>N/A</span>
        )
    })
  ])

  const {
    optimisticSortingState,
    optimisticPaginationState,
    isRouteRefreshPending,
    handleSortingChange,
    handlePaginationChange
  } = useServerManagedDataTable({
    searchParams
  })

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ['prescriptions'] as const,
    queryFn: getPrescriptions,
    placeholderData: keepPreviousData
  })

  const responseData = data?.data
  const prescriptions: IPrescription[] = useMemo(() => {
    if (Array.isArray(responseData)) return responseData
    if (
      responseData &&
      typeof responseData === 'object' &&
      'data' in responseData &&
      Array.isArray((responseData as { data?: unknown }).data)
    ) {
      return (responseData as { data: IPrescription[] }).data
    }
    if (Array.isArray(data)) return data as IPrescription[]
    return []
  }, [data, responseData])

  const meta: PaginationMeta | undefined =
    (responseData as { meta?: PaginationMeta } | undefined)?.meta ?? data?.meta

  const fetchError = isError
    ? error instanceof Error
      ? error.message
      : 'Unable to load prescriptions.'
    : data?.success === false
      ? data.message
      : (responseData as { success?: boolean; message?: string } | undefined)
            ?.success === false
        ? (responseData as { message?: string })?.message
        : undefined

  return (
    <section className='mx-auto w-full max-w-[1600px] space-y-5 px-4 py-5 md:px-8 md:py-7'>
      <header className='flex flex-wrap items-end justify-between gap-4'>
        <div>
          <p className='mb-1 text-xs font-bold uppercase text-primary'>
            Clinical records
          </p>
          <h1 className='text-2xl font-extrabold text-foreground'>
            Prescriptions
          </h1>
          <p className='mt-1 text-sm text-muted-foreground'>
            Browse and monitor clinical prescriptions and follow-up schedules.
          </p>
        </div>
        <div className='rounded-md border border-border bg-card px-3 py-2 text-sm text-muted-foreground'>
          <span className='font-semibold tabular-nums text-foreground'>
            {meta?.total ?? prescriptions.length}
          </span>{' '}
          {meta?.total === 1 || prescriptions.length === 1
            ? 'prescription'
            : 'prescriptions'}
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
        data={prescriptions}
        columns={columns}
        isLoading={isLoading}
        isFetching={isFetching}
        isUpdating={isRouteRefreshPending}
        error={fetchError}
        onRetry={() => void refetch()}
        emptyMessage='No prescriptions are available yet.'
        sorting={{
          state: optimisticSortingState,
          onSortingChange: handleSortingChange
        }}
        pagination={{
          state: optimisticPaginationState,
          onPaginationChange: handlePaginationChange
        }}
        meta={meta}
      />
    </section>
  )
}

export default PrescriptionsTable
