'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

import {
  flexRender,
  tableFeatures,
  useTable,
  SortingState,
  rowSortingFeature,
  rowPaginationFeature,
  createPaginatedRowModel,
  PaginationState,
  type ColumnDef,
  type RowData
} from '@tanstack/react-table'

import { Button, buttonVariants } from '@/components/ui/button'
import {
  MoreHorizontal,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  LoaderCircle,
  RotateCcw
} from 'lucide-react'
import DataTablePagination from '@/components/shared/DataTablePagination'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { PaginationMeta } from '@/types/api.types'
import DataTableSearch from '@/components/shared/DataTableSearch'
import DataTableFilters, {
  DataTableFilterConfig,
  DataTableFilterValue,
  DataTableFilterValues
} from '@/components/shared/DataTableFilters'

interface DataTableProps<TData extends RowData> {
  data: TData[]
  columns: ColumnDef<ReturnType<typeof tableFeatures>, TData>[]
  isLoading?: boolean
  isFetching?: boolean
  isUpdating?: boolean
  error?: string
  onRetry?: () => void
  emptyMessage?: string
  actions?: {
    onView?: (row: TData) => void
    onEdit?: (row: TData) => void
    onDelete?: (row: TData) => void
    onStatusChange?: (row: TData) => void
    onRoleChange?: (row: TData) => void
  }
  sorting?: {
    state: SortingState
    onSortingChange: (state: SortingState) => void
  }
  pagination?: {
    state: PaginationState
    onPaginationChange: (state: PaginationState) => void
  }
  search?: {
    initialValue?: string
    placeholder?: string
    debounceMs?: number
    onDebouncedChange: (value: string) => void
  }
  filters?: {
    configs: DataTableFilterConfig[]
    values: DataTableFilterValues
    onFilterChange: (
      filterId: string,
      value: DataTableFilterValue | undefined
    ) => void
    onClearAll?: () => void
  }
  meta?: PaginationMeta
  toolbarAction?: React.ReactNode
}

const DataTable = <TData extends RowData>({
  data,
  columns,
  actions,
  emptyMessage = 'No data available.',
  isLoading = false,
  isFetching = false,
  isUpdating = false,
  error,
  onRetry,
  sorting,
  pagination,
  meta,
  search,
  filters,
  toolbarAction
}: DataTableProps<TData>) => {
  const features = tableFeatures({
    rowSortingFeature,
    rowPaginationFeature,
    paginatedRowModel: createPaginatedRowModel()
  })

  const tableColumns: ColumnDef<ReturnType<typeof tableFeatures>, TData>[] =
    actions
      ? [
          ...columns,
          {
            id: 'actions',
            header: 'Actions',
            enableSorting: false,
            cell: (info) => {
              const rowData = info.row.original

              return (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={buttonVariants({
                      variant: 'ghost',
                      className: 'h-8 w-8 p-0'
                    })}>
                    <span className='sr-only'>Open menu</span>
                    <MoreHorizontal className='h-4 w-4' />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align='end'>
                    {actions.onView && (
                      <DropdownMenuItem
                        onClick={() => actions.onView?.(rowData)}>
                        View
                      </DropdownMenuItem>
                    )}

                    {actions.onEdit && (
                      <DropdownMenuItem
                        onClick={() => actions.onEdit?.(rowData)}>
                        Edit
                      </DropdownMenuItem>
                    )}

                    {actions.onDelete && (
                      <DropdownMenuItem
                        onClick={() => actions.onDelete?.(rowData)}
                        className='text-destructive'>
                        Delete
                      </DropdownMenuItem>
                    )}

                    {actions.onStatusChange && (
                      <DropdownMenuItem
                        onClick={() => actions.onStatusChange?.(rowData)}>
                        Change status
                      </DropdownMenuItem>
                    )}

                    {actions.onRoleChange && (
                      <DropdownMenuItem
                        onClick={() => actions.onRoleChange?.(rowData)}>
                        Change role
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            }
          }
        ]
      : columns

  const table = useTable({
    data,
    columns: tableColumns,
    features,
    manualSorting: !!sorting,
    manualPagination: !!pagination,
    pageCount: pagination ? Math.max(meta?.totalPages ?? 0, 0) : undefined,
    state: {
      ...(sorting ? { sorting: sorting.state } : {}),
      ...(pagination ? { pagination: pagination.state } : {})
    },
    onSortingChange: sorting
      ? (updater) => {
          const currentSortingState = sorting.state

          const nextSortingState =
            typeof updater === 'function'
              ? updater(currentSortingState)
              : updater

          sorting.onSortingChange(nextSortingState)
        }
      : undefined,
    onPaginationChange: pagination
      ? (updater) => {
          const currentPaginationState = pagination.state
          const nextPaginationState =
            typeof updater === 'function'
              ? updater(currentPaginationState)
              : updater

          pagination.onPaginationChange(nextPaginationState)
        }
      : undefined
  })

  const { getRowModel } = table
  const isBusy = isLoading || isFetching || isUpdating

  return (
    <div
      className='space-y-3'
      aria-busy={isBusy}>
      {(search || filters || toolbarAction) && (
        <div className='flex flex-col gap-3 rounded-lg border border-border bg-card p-3 md:flex-row md:flex-wrap md:items-center'>
          {search && (
            <DataTableSearch
              key={search.initialValue ?? ''}
              initialValue={search.initialValue}
              placeholder={search.placeholder}
              debounceMs={search.debounceMs}
              onDebouncedChange={search.onDebouncedChange}
              isLoading={isLoading}
              isFetching={isFetching}
            />
          )}

          {filters && (
            <DataTableFilters
              filters={filters.configs}
              values={filters.values}
              onFilterChange={filters.onFilterChange}
              onClearAll={filters.onClearAll}
              isLoading={isBusy}
              isFetching={isFetching}
            />
          )}

          {(isFetching || isUpdating) && (
            <span
              className='inline-flex h-9 items-center gap-2 text-sm text-muted-foreground'
              role='status'
              aria-live='polite'>
              <LoaderCircle
                className='h-4 w-4 animate-spin'
                aria-hidden='true'
              />
              Updating results
            </span>
          )}

          {toolbarAction && (
            <div className='md:ml-auto md:shrink-0'>{toolbarAction}</div>
          )}
        </div>
      )}
      {error && (
        <div
          className='flex flex-wrap items-center justify-between gap-3 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm'
          role='alert'>
          <div>
            <p className='font-semibold text-destructive'>
              {data.length > 0
                ? 'Could not refresh the directory.'
                : 'Could not load the directory.'}
            </p>
            <p className='mt-0.5 text-muted-foreground'>{error}</p>
          </div>
          {onRetry && (
            <Button
              type='button'
              size='sm'
              variant='outline'
              onClick={onRetry}
              disabled={isFetching}>
              <RotateCcw className='h-3.5 w-3.5' />
              Retry
            </Button>
          )}
        </div>
      )}

      <div className='overflow-hidden rounded-lg border border-border bg-card'>
        <div className='relative'>
          <Table className='min-w-225'>
            <TableHeader className='bg-muted/50'>
              {table.getHeaderGroups().map((hg) => (
                <TableRow
                  key={hg.id}
                  className='hover:bg-transparent'>
                  {hg.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className='h-10 px-3 text-[11px] font-semibold uppercase text-muted-foreground'>
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <Button
                          variant='ghost'
                          className='h-auto cursor-pointer p-0 text-[11px] font-semibold uppercase text-muted-foreground hover:bg-transparent hover:text-foreground focus-visible:ring-0'
                          onClick={header.column.getToggleSortingHandler()}>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}

                          {header.column.getIsSorted() === 'asc' ? (
                            <ArrowUp className='ml-1 h-3.5 w-3.5' />
                          ) : header.column.getIsSorted() === 'desc' ? (
                            <ArrowDown className='ml-1 h-3.5 w-3.5' />
                          ) : (
                            <ArrowUpDown className='ml-1 h-3.5 w-3.5 opacity-50' />
                          )}
                        </Button>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {isLoading || isFetching || isUpdating ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow
                    key={`skeleton-${index}`}
                    className='h-17'>
                    {tableColumns.map((_, cellIndex) => (
                      <TableCell
                        key={cellIndex}
                        className='px-3 py-3'>
                        <div className='h-4 w-full max-w-32 animate-pulse rounded-sm bg-muted' />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan={tableColumns.length}
                    className='h-32 whitespace-normal px-4 text-center text-sm text-muted-foreground'>
                    Directory data is unavailable. Use Retry to try again.
                  </TableCell>
                </TableRow>
              ) : getRowModel().rows.length > 0 ? (
                getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className='h-17 hover:bg-muted/30'>
                    {row.getAllCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className='px-3 py-3'>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={tableColumns.length}
                    className='h-32 whitespace-normal px-4 text-center text-sm text-muted-foreground'>
                    {error ? 'Directory data is unavailable.' : emptyMessage}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {pagination && (
        <DataTablePagination
          table={table}
          totalPages={meta?.totalPages}
          totalRows={meta?.total}
          isLoading={isBusy}
          isFetching={isFetching}
        />
      )}
    </div>
  )
}

export default DataTable
