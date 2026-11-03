'use client'

import { cn } from '@/app/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { PaginationState } from '@tanstack/react-table'
import { ChevronLeft, ChevronRight, LoaderCircle } from 'lucide-react'
import { useMemo, useState } from 'react'

type PaginationToken = number | 'start-ellipsis' | 'end-ellipsis'

const DEFAULT_PAGE_SIZES = [1, 10, 20, 50, 100] as const

const isDefaultPageSize = (value: number) => {
  return DEFAULT_PAGE_SIZES.includes(
    value as (typeof DEFAULT_PAGE_SIZES)[number]
  )
}

const getPaginationItems = (
  currentPage: number,
  totalPages: number
): PaginationToken[] => {
  if (totalPages <= 0) {
    return []
  }

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  if (currentPage <= 5) {
    return [1, 2, 3, 4, 5, 'end-ellipsis', totalPages]
  }

  if (currentPage >= totalPages - 4) {
    return [
      1,
      'start-ellipsis',
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages
    ]
  }

  return [
    1,
    'start-ellipsis',
    currentPage - 2,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    currentPage + 2,
    'end-ellipsis',
    totalPages
  ]
}

export interface DataTablePaginationTable {
  state: { pagination: PaginationState }
  getPageCount: () => number
  getRowCount: () => number
  getCanPreviousPage: () => boolean
  getCanNextPage: () => boolean
  previousPage: () => void
  nextPage: () => void
  setPageIndex: (updater: number | ((old: number) => number)) => void
  setPagination: (
    updater: PaginationState | ((old: PaginationState) => PaginationState)
  ) => void
}

interface DataTablePaginationProps {
  table: DataTablePaginationTable
  totalRows?: number
  totalPages?: number
  isLoading?: boolean
  isFetching?: boolean
}

const DataTablePagination = ({
  table,
  totalRows,
  totalPages,
  isLoading,
  isFetching
}: DataTablePaginationProps) => {
  const pagination = table.state.pagination
  const pageSize = pagination.pageSize
  const currentPage = pagination.pageIndex + 1
  const computedTotalPages = totalPages ?? table.getPageCount()

  const [customModePageSize, setCustomModePageSize] = useState<number | null>(
    null
  )
  const [customPageSizeDraft, setCustomPageSizeDraft] = useState({
    pageSize,
    value: String(pageSize)
  })
  const customPageSize =
    customPageSizeDraft.pageSize === pageSize
      ? customPageSizeDraft.value
      : String(pageSize)

  const isCurrentPageSizeCustom = !isDefaultPageSize(pageSize)
  const showCustomInput =
    customModePageSize === pageSize || isCurrentPageSizeCustom
  const pageSizeSelectValue = showCustomInput ? 'custom' : String(pageSize)

  const paginationItems = useMemo(
    () => getPaginationItems(currentPage, computedTotalPages),
    [currentPage, computedTotalPages]
  )

  const applyCustomPageSize = () => {
    const parsed = Number(customPageSize)
    if (!Number.isInteger(parsed) || parsed <= 0) {
      return
    }

    setCustomModePageSize(null)

    table.setPagination({
      pageIndex: 0,
      pageSize: parsed
    })
  }

  const onPageSizeSelect = (value: string | null) => {
    if (value === null) {
      return
    }

    if (value === 'custom') {
      setCustomModePageSize(pageSize)
      setCustomPageSizeDraft({ pageSize, value: String(pageSize) })
      return
    }

    const parsed = Number(value)
    if (!Number.isInteger(parsed) || parsed <= 0) {
      return
    }

    setCustomModePageSize(null)
    setCustomPageSizeDraft({ pageSize: parsed, value: String(parsed) })

    table.setPagination({
      pageIndex: 0,
      pageSize: parsed
    })
  }

  const jumpBackwardTarget = Math.max(1, currentPage - 5)
  const jumpForwardTarget = Math.min(computedTotalPages, currentPage + 5)

  if (computedTotalPages <= 0) {
    return null
  }

  return (
    <div
      className='flex flex-col gap-3 border-t px-4 py-3 md:flex-row md:items-center md:justify-between'
      aria-busy={isLoading || isFetching}>
      <div className='flex flex-wrap items-center gap-2'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage() || isLoading || isFetching}>
          <ChevronLeft className='h-4 w-4' />
          Prev
        </Button>

        {paginationItems.map((item) => {
          if (item === 'start-ellipsis') {
            return (
              <Button
                key='start-ellipsis'
                variant='ghost'
                size='sm'
                className='min-w-9 px-2'
                onClick={() => table.setPageIndex(jumpBackwardTarget - 1)}
                disabled={isLoading || isFetching}>
                ...
              </Button>
            )
          }

          if (item === 'end-ellipsis') {
            return (
              <Button
                key='end-ellipsis'
                variant='ghost'
                size='sm'
                className='min-w-9 px-2'
                onClick={() => table.setPageIndex(jumpForwardTarget - 1)}
                disabled={isLoading || isFetching}>
                ...
              </Button>
            )
          }

          const isActive = item === currentPage
          return (
            <Button
              key={item}
              variant={isActive ? 'default' : 'outline'}
              size='sm'
              className={cn('min-w-9', isActive && 'pointer-events-none')}
              onClick={() => table.setPageIndex(item - 1)}
              disabled={isLoading || isFetching}>
              {item}
            </Button>
          )
        })}

        <Button
          variant='outline'
          size='sm'
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage() || isLoading || isFetching}>
          Next
          <ChevronRight className='h-4 w-4' />
        </Button>
      </div>

      <div className='flex flex-wrap items-center gap-2 text-sm text-muted-foreground'>
        <Select
          value={pageSizeSelectValue}
          onValueChange={onPageSizeSelect}>
          <SelectTrigger
            className='w-24'
            aria-label='Rows per page'
            disabled={isLoading || isFetching}>
            <SelectValue placeholder='Limit' />
          </SelectTrigger>

          <SelectContent>
            {DEFAULT_PAGE_SIZES.map((size) => (
              <SelectItem
                key={size}
                value={String(size)}>
                {size}
              </SelectItem>
            ))}
            <SelectItem value='custom'>Custom</SelectItem>
          </SelectContent>
        </Select>
        <span>rows</span>

        {showCustomInput && (
          <div className='flex items-center gap-2'>
            <Input
              type='number'
              min={1}
              className='h-9 w-24'
              value={customPageSize}
              onChange={(event) =>
                setCustomPageSizeDraft({
                  pageSize,
                  value: event.target.value
                })
              }
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  applyCustomPageSize()
                }
              }}
            />
            <Button
              size='sm'
              variant='outline'
              onClick={applyCustomPageSize}
              disabled={isLoading || isFetching}>
              Apply
            </Button>
          </div>
        )}

        <span className='ml-2'>
          Total {totalRows ?? table.getRowCount()} items, {computedTotalPages}{' '}
          pages
        </span>
        {isFetching && (
          <span
            className='inline-flex items-center gap-1.5 text-primary'
            role='status'
            aria-live='polite'>
            <LoaderCircle
              className='h-3.5 w-3.5 animate-spin'
              aria-hidden='true'
            />
            Updating page
          </span>
        )}
      </div>
    </div>
  )
}

export default DataTablePagination
