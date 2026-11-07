'use client'

import DateCell from '@/components/modules/dashboard/DateCell'
import UserInfoCell from '@/components/modules/dashboard/UserInfoCell'
import ViewReviewModal from '@/components/modules/dashboard/doctor/ViewReviewModal'
import DataTable from '@/components/shared/DataTable'
import {
  DataTableFilterConfig,
  DataTableFilterValues
} from '@/components/shared/DataTableFilters'
import { Badge } from '@/components/ui/badge'
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
import { Calendar, RotateCcw, Star, ThumbsUp } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10

const REVIEW_FILTER_DEFINITIONS = [serverManagedFilter.single('rating')]

const DoctorReviewsTable = () => {
  type TableFeatures = ReturnType<typeof tableFeatures>
  const columnHelper = createColumnHelper<TableFeatures, IReview>()
  const searchParams = useSearchParams()

  const [viewingReview, setViewingReview] = useState<IReview | null>(null)

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

  const { filterValues, handleFilterChange, clearAllFilters } =
    useServerManagedDataTableFilters({
      searchParams,
      definitions: REVIEW_FILTER_DEFINITIONS,
      updateParams
    })

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

  const filterValuesForTable = useMemo<DataTableFilterValues>(() => {
    return {
      rating: filterValues.rating
    }
  }, [filterValues])

  const { searchTermFromUrl, handleDebouncedSearchChange } =
    useServerManagedDataTableSearch({
      searchParams,
      updateParams
    })

  const hasActiveFilters = Boolean(filterValues.rating)

  const emptyMessage =
    searchTermFromUrl || hasActiveFilters
      ? 'No reviews match your filters.'
      : 'You have not received any patient reviews yet.'

  const fetchError = isError
    ? error instanceof Error
      ? error.message
      : 'Unable to load reviews.'
    : reviewDataResponse?.success === false
      ? reviewDataResponse.message
      : undefined

  // Compute average rating and high rating count
  const averageRating = useMemo(() => {
    if (!reviews.length) return 0
    const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0)
    return sum / reviews.length
  }, [reviews])

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
                name={patient?.name || 'Anonymous Patient'}
                email={patient?.email || 'N/A'}
                profilePhoto={patient?.profilePhoto || undefined}
              />
            )
          }
        }),
        columnHelper.accessor('rating', {
          id: 'rating',
          header: 'Rating',
          enableSorting: true,
          cell: ({ getValue }) => {
            const rating = Number(getValue()) || 0
            return (
              <div className='flex items-center gap-2'>
                <div className='flex items-center gap-0.5 text-amber-500'>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`size-3.5 ${
                        i < Math.round(rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-muted-foreground/30'
                      }`}
                    />
                  ))}
                </div>
                <span className='font-bold tabular-nums text-foreground text-xs'>
                  {rating.toFixed(1)}
                </span>
              </div>
            )
          }
        }),
        columnHelper.accessor('comment', {
          id: 'comment',
          header: 'Feedback / Comment',
          enableSorting: false,
          cell: ({ getValue }) => {
            const comment = getValue()
            return (
              <p
                className='max-w-[340px] truncate text-sm text-foreground'
                title={comment ?? undefined}>
                {comment ? (
                  `"${comment}"`
                ) : (
                  <span className='italic text-muted-foreground'>
                    No written feedback provided.
                  </span>
                )}
              </p>
            )
          }
        }),

        columnHelper.accessor('createdAt', {
          id: 'createdAt',
          header: 'Reviewed On',
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
      onView: (review: IReview) => {
        setViewingReview(review)
      }
    }),
    []
  )

  return (
    <section className='mx-auto w-full max-w-[1600px] space-y-5 px-4 py-5 md:px-8 md:py-7'>
      <header className='flex flex-wrap items-end justify-between gap-4'>
        <div>
          <p className='mb-1 text-xs font-bold uppercase tracking-wider text-primary'>
            Patient Feedback
          </p>
          <h1 className='text-2xl font-extrabold text-foreground'>
            My Reviews
          </h1>
          <p className='mt-1 text-sm text-muted-foreground'>
            Browse patient ratings, consultation reviews, and experience
            feedback.
          </p>
        </div>

        <div className='flex items-center gap-3'>
          {reviews.length > 0 && (
            <div className='flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50/70 px-3 py-2 text-sm text-amber-800 shadow-2xs dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300'>
              <Star className='size-4 fill-amber-400 text-amber-400' />
              <span className='font-bold tabular-nums'>
                {averageRating.toFixed(1)}
              </span>
              <span className='text-xs text-muted-foreground'>avg rating</span>
            </div>
          )}

          <div className='rounded-md border border-border bg-card px-3 py-2 text-sm text-muted-foreground shadow-2xs'>
            <span className='font-semibold tabular-nums text-foreground'>
              {meta?.total ?? reviews.length}
            </span>{' '}
            {meta?.total === 1 || reviews.length === 1 ? 'review' : 'reviews'}
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
        data={reviews}
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
          placeholder: 'Search by patient name or comment...',
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

      <ViewReviewModal
        open={Boolean(viewingReview)}
        onOpenChange={(open) => {
          if (!open) {
            setViewingReview(null)
          }
        }}
        review={viewingReview}
      />
    </section>
  )
}

export default DoctorReviewsTable
