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
  type ColumnDef,
  type RowData
} from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { Pencil, Eye, Trash2, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

interface DataTableProps<TData extends RowData> {
  data: TData[]
  columns: ColumnDef<ReturnType<typeof tableFeatures>, TData>[]
  isLoading?: boolean
  emptyMessage?: string
  actions?: {
    onView?: (row: TData) => void
    onEdit?: (row: TData) => void
    onDelete?: (row: TData) => void
  }
}

const DataTable = <TData extends RowData>({
  data,
  columns,
  actions,
  emptyMessage = 'No data available.',
  isLoading = false
}: DataTableProps<TData>) => {
  const features = tableFeatures({})

  const tableColumns: ColumnDef<ReturnType<typeof tableFeatures>, TData>[] =
    actions
      ? [
          ...columns,
          {
            id: 'actions',
            header: 'Actions',
            cell: (info) => {
              const rowData = info.row.original

              return (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='ghost'
                      className='h-8 w-8 p-0'>
                      <span className='sr-only'>Open menu</span>
                      <MoreHorizontal className='h-4 w-4' />
                    </Button>
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
    features
  })

  const { getHeaderGroups, getRowModel } = table

  return (
    <Table>
      <TableHeader>
        {getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>

      <TableBody>
        {/* Loading State */}
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={`skeleton-${index}`}>
              {tableColumns.map((_, cellIndex) => (
                <TableCell key={cellIndex}>
                  <div className='h-4 w-full max-w-32 animate-pulse rounded-md bg-muted' />
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : getRowModel().rows.length > 0 ? (
          /* Data State */
          getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getAllCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          /* Empty State */
          <TableRow>
            <TableCell
              colSpan={tableColumns.length}
              className='h-32 text-center text-muted-foreground'>
              {emptyMessage}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

export default DataTable
