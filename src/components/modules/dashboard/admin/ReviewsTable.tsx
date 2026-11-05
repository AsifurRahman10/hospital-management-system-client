'use client'

import DateCell from '@/components/modules/dashboard/DateCell'
import UserInfoCell from '@/components/modules/dashboard/UserInfoCell'
import DataTable from '@/components/shared/DataTable'
import { Button } from '@/components/ui/button'
import { useServerManagedDataTable } from '@/hooks/useServerManagedDataTable'
import { getReviews } from '@/service/review.service'
import { PaginationMeta } from '@/types/api.types'
import { IReview } from '@/types/review.type'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { createColumnHelper, tableFeatures } from '@tanstack/react-table'
import { RotateCcw, Star } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10

const ReviewsTable = () => {
  type TableFeatures = ReturnType<typeof tableFeatures>
  const columnHelper = createColumnHelper<TableFeatures, IReview>()
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
    columnHelper.accessor('rating', {
      header: 'Rating',
      cell: ({ getValue }) => {
        const rating = getValue()
        return (
          <div className='flex items-center gap-1.5'>
            <Star className='size-4 fill-yellow-400 text-yellow-400' />
            <span className='font-semibold tabular-nums text-foreground'>
              {rating != null ? rating.toFixed(1) : '0.0'}
            </span>
          </div>
        )
      }
    }),
    columnHelper.accessor('comment', {
      header: 'Review Comment',
      cell: ({ getValue }) => {
        const comment = getValue()
        return (
          <p
            className='max-w-[320px] truncate text-sm text-foreground'
            title={comment ?? undefined}>
            {comment || 'No comment provided.'}
          </p>
        )
      }
    }),
    columnHelper.accessor('createdAt', {
      header: 'Reviewed On',
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
    searchParams,
    defaultPage: DEFAULT_PAGE,
    defaultLimit: DEFAULT_LIMIT
  })

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ['reviews'] as const,
    queryFn: getReviews,
    placeholderData: keepPreviousData
  })

  const responseData = data?.data
  const reviews: IReview[] = useMemo(() => {
    if (Array.isArray(responseData)) return responseData
    if (
      responseData &&
      typeof responseData === 'object' &&
      'data' in responseData &&
      Array.isArray((responseData as { data?: unknown }).data)
    ) {
      return (responseData as { data: IReview[] }).data
    }
    if (Array.isArray(data)) return data as IReview[]
    return []
  }, [data, responseData])

  const meta: PaginationMeta | undefined =
    (responseData as { meta?: PaginationMeta } | undefined)?.meta ?? data?.meta

  const fetchError = isError
    ? error instanceof Error
      ? error.message
      : 'Unable to load reviews.'
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
            Patient feedback
          </p>
          <h1 className='text-2xl font-extrabold text-foreground'>Reviews</h1>
          <p className='mt-1 text-sm text-muted-foreground'>
            Browse doctor ratings and patient feedback across consultations.
          </p>
        </div>
        <div className='rounded-md border border-border bg-card px-3 py-2 text-sm text-muted-foreground'>
          <span className='font-semibold tabular-nums text-foreground'>
            {meta?.total ?? reviews.length}
          </span>{' '}
          {meta?.total === 1 || reviews.length === 1 ? 'review' : 'reviews'}
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
        data={reviews}
        columns={columns}
        isLoading={isLoading}
        isFetching={isFetching}
        isUpdating={isRouteRefreshPending}
        error={fetchError}
        onRetry={() => void refetch()}
        emptyMessage='No reviews are available yet.'
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

export default ReviewsTable
