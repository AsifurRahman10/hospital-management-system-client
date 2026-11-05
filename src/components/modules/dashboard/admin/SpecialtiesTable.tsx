'use client'

import CreateSpecialtyFormModal from '@/components/modules/dashboard/admin/CreateSpecialtyFormModal'
import EditSpecialtyModal from '@/components/modules/dashboard/admin/EditSpecialtyModal'
import DateCell from '@/components/modules/dashboard/DateCell'
import DataTable from '@/components/shared/DataTable'
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
import { Button } from '@/components/ui/button'
import { useRowActionModalState } from '@/hooks/useRowActionModalState'
import { useServerManagedDataTable } from '@/hooks/useServerManagedDataTable'
import {
  deleteSpecialty,
  getSpecialties
} from '@/service/specialty.service'
import { PaginationMeta } from '@/types/api.types'
import { ISpecialty } from '@/types/specialty.types'
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query'
import { createColumnHelper, tableFeatures } from '@tanstack/react-table'
import { RotateCcw, Stethoscope } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import { toast } from 'sonner'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10

const SpecialtiesTable = () => {
  type TableFeatures = ReturnType<typeof tableFeatures>
  const columnHelper = createColumnHelper<TableFeatures, ISpecialty>()
  const queryClient = useQueryClient()
  const searchParams = useSearchParams()

  const columns = columnHelper.columns([
    columnHelper.accessor('icon', {
      header: 'Icon',
      enableSorting: false,
      cell: ({ row }) => (
        <div className='flex size-10 items-center justify-center overflow-hidden rounded-md border border-border bg-muted'>
          {row.original.icon ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={row.original.icon}
              alt={row.original.title}
              className='size-full object-cover'
            />
          ) : (
            <Stethoscope className='size-5 text-muted-foreground' />
          )}
        </div>
      )
    }),
    columnHelper.accessor('title', {
      header: 'Specialty Title',
      cell: ({ getValue }) => (
        <span className='font-medium text-foreground'>{getValue()}</span>
      )
    }),
    columnHelper.accessor('description', {
      header: 'Description',
      cell: ({ getValue }) => (
        <span className='line-clamp-1 text-sm text-muted-foreground'>
          {getValue() || 'N/A'}
        </span>
      )
    }),
    columnHelper.accessor('createdAt', {
      header: 'Created On',
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
    editingItem,
    deletingItem,
    isEditModalOpen,
    isDeleteDialogOpen,
    onEditOpenChange,
    onDeleteOpenChange,
    tableActions
  } = useRowActionModalState<ISpecialty>({
    enableView: false,
    enableEdit: true
  })

  const {
    queryStringFromUrl,
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
    queryKey: ['specialties', queryStringFromUrl] as const,
    queryFn: ({ queryKey: [, queryString] }) => getSpecialties(queryString),
    placeholderData: keepPreviousData
  })

  const responseData = data?.data
  const specialties: ISpecialty[] = useMemo(() => {
    if (Array.isArray(responseData)) return responseData
    if (
      responseData &&
      typeof responseData === 'object' &&
      'data' in responseData &&
      Array.isArray((responseData as { data?: unknown }).data)
    ) {
      return (responseData as { data: ISpecialty[] }).data
    }
    if (Array.isArray(data)) return data as ISpecialty[]
    return []
  }, [data, responseData])

  const meta: PaginationMeta | undefined =
    (responseData as { meta?: PaginationMeta } | undefined)?.meta ?? data?.meta

  const refreshSpecialties = async () => {
    await queryClient.invalidateQueries({ queryKey: ['specialties'] })
    await queryClient.refetchQueries({
      queryKey: ['specialties'],
      type: 'active'
    })
  }

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSpecialty(id),
    onSuccess: async (result) => {
      if (!result.success) {
        toast.error(result.message || 'Failed to delete specialty')
        return
      }
      toast.success(result.message || 'Specialty deleted successfully')
      onDeleteOpenChange(false)
      await refreshSpecialties()
    },
    onError: (mutationError) =>
      toast.error(
        mutationError instanceof Error
          ? mutationError.message
          : 'Failed to delete specialty'
      )
  })

  const actions = useMemo(
    () => ({
      ...tableActions
    }),
    [tableActions]
  )

  const fetchError = isError
    ? error instanceof Error
      ? error.message
      : 'Unable to load specialties.'
    : data?.success === false
      ? data.message
      : (responseData as { success?: boolean; message?: string } | undefined)
            ?.success === false
        ? (responseData as { message?: string })?.message
        : undefined

  return (
    <>
      <section className='mx-auto w-full max-w-[1600px] space-y-5 px-4 py-5 md:px-8 md:py-7'>
        <header className='flex flex-wrap items-end justify-between gap-4'>
          <div>
            <p className='mb-1 text-xs font-bold uppercase text-primary'>
              Clinical management
            </p>
            <h1 className='text-2xl font-extrabold text-foreground'>
              Specialties
            </h1>
            <p className='mt-1 text-sm text-muted-foreground'>
              Browse and manage medical departments and clinical specialties.
            </p>
          </div>
          <div className='rounded-md border border-border bg-card px-3 py-2 text-sm text-muted-foreground'>
            <span className='font-semibold tabular-nums text-foreground'>
              {meta?.total ?? specialties.length}
            </span>{' '}
            {meta?.total === 1 || specialties.length === 1
              ? 'specialty'
              : 'specialties'}
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
          data={specialties}
          columns={columns}
          isLoading={isLoading}
          isFetching={isFetching}
          isUpdating={isRouteRefreshPending}
          error={fetchError}
          onRetry={() => void refetch()}
          emptyMessage='No specialties are available yet.'
          sorting={{
            state: optimisticSortingState,
            onSortingChange: handleSortingChange
          }}
          pagination={{
            state: optimisticPaginationState,
            onPaginationChange: handlePaginationChange
          }}
          meta={meta}
          toolbarAction={<CreateSpecialtyFormModal />}
          actions={actions}
        />
      </section>

      <EditSpecialtyModal
        open={isEditModalOpen}
        onOpenChange={onEditOpenChange}
        specialty={editingItem}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={onDeleteOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Specialty</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{' '}
              <span className='font-medium text-foreground'>
                {deletingItem?.title ?? 'this specialty'}
              </span>
              ? This action cannot be undone.
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
                if (deletingItem) deleteMutation.mutate(deletingItem.id)
              }}>
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default SpecialtiesTable
