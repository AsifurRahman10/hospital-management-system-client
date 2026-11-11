'use client'

import DateCell from '@/components/modules/dashboard/DateCell'
import UserInfoCell from '@/components/modules/dashboard/UserInfoCell'
import ViewReviewModal from '@/components/modules/dashboard/doctor/ViewReviewModal'
import DataTable from '@/components/shared/DataTable'
import {
  DataTableFilterConfig,
  DataTableFilterValues
} from '@/components/shared/DataTableFilters'
import { Button } from '@/components/ui/button'
import { useServerManagedDataTable } from '@/hooks/useServerManagedDataTable'
import {
  serverManagedFilter,
  useServerManagedDataTableFilters
} from '@/hooks/useServerManagedDataTableFilters'
import { useServerManagedDataTableSearch } from '@/hooks/useServerManagedDataTableSearch'
import { getMyReviews } from '@/service/review.service'
import { PaginationMeta } from '@/types/api.types'
import { IReview } from '@/types/review.type'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { createColumnHelper, tableFeatures } from '@tanstack/react-table'
import { Plus, RotateCcw, Star } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import React, { useMemo, useState } from 'react'
import DeleteReviewDialog from './DeleteReviewDialog'
import EditReviewModal from './EditReviewModal'
import GiveReviewModal from './GiveReviewModal'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10

const REVIEW_FILTER_DEFINITIONS = [serverManagedFilter.single('rating')]

export const PatientReviewsTable = () => {
  type TableFeatures = ReturnType<typeof tableFeatures>
  const columnHelper = createColumnHelper<TableFeatures, IReview>()
  const searchParams = useSearchParams()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [viewingReview, setViewingReview] = useState<IReview | null>(null)
  const [editingReview, setEditingReview] = useState<IReview | null>(null)
  const [deletingReview, setDeletingReview] = useState<IReview | null>(null)

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

  const { filterValues, handleFilterChange, clearAllFilters } =
    useServerManagedDataTableFilters({
      searchParams,
      definitions: REVIEW_FILTER_DEFINITIONS,
      updateParams
    })

  const { searchTermFromUrl, handleDebouncedSearchChange } =
    useServerManagedDataTableSearch({
      searchParams,
      updateParams
    })

  const filterValuesForTable = useMemo<DataTableFilterValues>(() => {
    return {
      rating: filterValues.rating
    }
  }, [filterValues])

  const filterConfigs = useMemo<DataTableFilterConfig[]>(() => {
    return [
      {
        id: 'rating',
        label: 'Rating',
        type: 'single-select',
        options: [
          { label: '5 Stars', value: '5' },
          { label: '4 Stars', value: '4' },
          { label: '3 Stars', value: '3' },
          { label: '2 Stars', value: '2' },
          { label: '1 Star', value: '1' }
        ]
      }
    ]
  }, [])

  const hasActiveFilters = Boolean(filterValues.rating)
  const emptyMessage =
    searchTermFromUrl || hasActiveFilters
      ? 'No reviews match your search or filters.'
      : 'You have not submitted any reviews yet.'

  const queryString = queryStringFromUrl

  const {
    data: reviewDataResponse,
    isLoading,
    isFetching,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['my-reviews', queryString] as const,
    queryFn: ({ queryKey: [, query] }) => getMyReviews(query),
    placeholderData: keepPreviousData
  })

  const reviewResponseData = reviewDataResponse?.data
  const reviews: IReview[] = useMemo(() => {
    if (!reviewResponseData) return []
    if (Array.isArray(reviewResponseData)) return reviewResponseData
    if (
      'data' in reviewResponseData &&
      Array.isArray((reviewResponseData as unknown as { data: IReview[] }).data)
    ) {
      return (reviewResponseData as unknown as { data: IReview[] }).data
    }
    return []
  }, [reviewResponseData])

  const meta: PaginationMeta | undefined =
    reviewDataResponse?.meta ??
    (reviewResponseData && 'meta' in reviewResponseData
      ? (reviewResponseData as unknown as { meta: PaginationMeta }).meta
      : undefined)

  const fetchError = isError
    ? error instanceof Error
      ? error.message
      : 'Unable to load your reviews.'
    : reviewDataResponse?.success === false
      ? reviewDataResponse.message
      : undefined

  const columns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor('doctor', {
          id: 'doctor',
          header: 'Doctor',
          enableSorting: false,
          cell: ({ row }) => (
            <UserInfoCell
              name={row.original.doctor?.name ?? 'Unknown doctor'}
              email={row.original.doctor?.email ?? 'N/A'}
              profilePhoto={row.original.doctor?.profilePhoto ?? undefined}
            />
          )
        }),
        columnHelper.accessor('rating', {
          id: 'rating',
          header: 'Rating',
          enableSorting: true,
          cell: ({ getValue }) => {
            const rating = Number(getValue()) || 0
            return (
              <div className='flex items-center gap-1.5'>
                <Star className='size-4 fill-yellow-400 text-yellow-400' />
                <span className='font-semibold tabular-nums text-foreground'>
                  {rating.toFixed(1)}
                </span>
              </div>
            )
          }
        }),
        columnHelper.accessor('comment', {
          id: 'comment',
          header: 'Review Comment',
          enableSorting: false,
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
          id: 'createdAt',
          header: 'Reviewed On',
          enableSorting: true,
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
      ]),
    [columnHelper]
  )

  const tableActions = useMemo(
    () => ({
      onView: (review: IReview) => setViewingReview(review),
      onEdit: (review: IReview) => setEditingReview(review),
      onDelete: (review: IReview) => setDeletingReview(review)
    }),
    []
  )

  return (
    <section className='mx-auto w-full max-w-[1600px] space-y-5 px-4 py-5 md:px-8 md:py-7'>
      <header className='flex flex-wrap items-end justify-between gap-4'>
        <div>
          <p className='mb-1 text-xs font-bold uppercase tracking-wider text-primary'>
            Patient feedback
          </p>
          <h1 className='text-2xl font-extrabold text-foreground'>My Reviews</h1>
          <p className='mt-1 text-sm text-muted-foreground'>
            Browse doctor ratings and patient feedback across consultations.
          </p>
        </div>

        <div className='flex items-center gap-3'>
          <div className='rounded-md border border-border bg-card px-3 py-2 text-sm text-muted-foreground'>
            <span className='font-semibold tabular-nums text-foreground'>
              {meta?.total ?? reviews.length}
            </span>{' '}
            {meta?.total === 1 || reviews.length === 1 ? 'review' : 'reviews'}
          </div>

          <Button
            type='button'
            onClick={() => setIsCreateOpen(true)}
            className='gap-1.5 bg-primary text-white shadow-xs hover:bg-primary/90'>
            <Plus className='size-4' />
            <span>Give Review</span>
          </Button>
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
        emptyMessage={emptyMessage}
        actions={tableActions}
        search={{
          initialValue: searchTermFromUrl,
          placeholder: 'Search by doctor name or comment...',
          debounceMs: 500,
          onDebouncedChange: handleDebouncedSearchChange
        }}
        filters={{
          configs: filterConfigs,
          values: filterValuesForTable,
          onFilterChange: handleFilterChange,
          onClearAll: clearAllFilters
        }}
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

      {/* Give Review Modal */}
      <GiveReviewModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />

      {/* Edit Review Modal */}
      <EditReviewModal
        open={Boolean(editingReview)}
        onOpenChange={(val) => !val && setEditingReview(null)}
        review={editingReview}
      />

      {/* Delete Review Dialog */}
      <DeleteReviewDialog
        open={Boolean(deletingReview)}
        onOpenChange={(val) => !val && setDeletingReview(null)}
        review={deletingReview}
      />

      {/* View Review Modal */}
      <ViewReviewModal
        open={Boolean(viewingReview)}
        onOpenChange={(val) => !val && setViewingReview(null)}
        review={viewingReview}
      />
    </section>
  )
}

export default PatientReviewsTable
