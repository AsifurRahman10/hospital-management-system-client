'use client'

import DateCell from '@/components/modules/dashboard/DateCell'
import UserInfoCell from '@/components/modules/dashboard/UserInfoCell'
import CreatePrescriptionModal from '@/components/modules/dashboard/doctor/CreatePrescriptionModal'
import DeletePrescriptionDialog from '@/components/modules/dashboard/doctor/DeletePrescriptionDialog'
import EditPrescriptionModal from '@/components/modules/dashboard/doctor/EditPrescriptionModal'
import ViewPrescriptionModal from '@/components/modules/dashboard/doctor/ViewPrescriptionModal'
import DataTable from '@/components/shared/DataTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useRowActionModalState } from '@/hooks/useRowActionModalState'
import { getMyPrescriptions } from '@/service/prescription.service'
import { IPrescription } from '@/types/prescription.type'
import { useQuery } from '@tanstack/react-query'
import {
  PaginationState,
  SortingState,
  createColumnHelper,
  tableFeatures
} from '@tanstack/react-table'
import { format } from 'date-fns'
import {
  CalendarCheck,
  Download,
  FileText,
  RotateCcw
} from 'lucide-react'
import { useMemo, useState } from 'react'

const formatDate = (dateStr?: string | Date) => {
  if (!dateStr) return 'N/A'
  try {
    const d = new Date(dateStr)
    return Number.isNaN(d.getTime()) ? 'N/A' : format(d, 'MMM dd, yyyy')
  } catch {
    return 'N/A'
  }
}

const DoctorPrescriptionsTable = () => {
  type TableFeatures = ReturnType<typeof tableFeatures>
  const columnHelper = createColumnHelper<TableFeatures, IPrescription>()

  const [searchTerm, setSearchTerm] = useState('')
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'createdAt', desc: true }
  ])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  })

  const {
    viewingItem,
    editingItem,
    deletingItem,
    isViewDialogOpen,
    isEditModalOpen,
    isDeleteDialogOpen,
    onViewOpenChange,
    onEditOpenChange,
    onDeleteOpenChange,
    tableActions
  } = useRowActionModalState<IPrescription>({
    enableView: true,
    enableEdit: true,
    enableDelete: true
  })

  // Fetch doctor's prescriptions
  const {
    data: prescriptionsResponse,
    isLoading,
    isFetching,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['my-prescriptions'],
    queryFn: () => getMyPrescriptions()
  })

  const allPrescriptions = useMemo<IPrescription[]>(() => {
    if (!prescriptionsResponse) return []
    const raw = prescriptionsResponse.data
    if (Array.isArray(raw)) return raw
    if (
      raw &&
      typeof raw === 'object' &&
      'data' in raw &&
      Array.isArray((raw as unknown as { data: IPrescription[] }).data)
    ) {
      return (raw as unknown as { data: IPrescription[] }).data
    }
    if (Array.isArray(prescriptionsResponse)) {
      return prescriptionsResponse as unknown as IPrescription[]
    }
    return []
  }, [prescriptionsResponse])

  // Client-side search filtering
  const filteredPrescriptions = useMemo(() => {
    if (!searchTerm.trim()) return allPrescriptions
    const term = searchTerm.toLowerCase()

    return allPrescriptions.filter((item) => {
      const patientName = item.patient?.name?.toLowerCase() || ''
      const patientEmail = item.patient?.email?.toLowerCase() || ''
      const instructions = item.instructions?.toLowerCase() || ''
      const id = item.id?.toLowerCase() || ''
      const appointmentId = item.appointmentId?.toLowerCase() || ''

      return (
        patientName.includes(term) ||
        patientEmail.includes(term) ||
        instructions.includes(term) ||
        id.includes(term) ||
        appointmentId.includes(term)
      )
    })
  }, [allPrescriptions, searchTerm])

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
                name={patient?.name || 'Unnamed Patient'}
                email={patient?.email || 'N/A'}
                profilePhoto={patient?.profilePhoto || undefined}
              />
            )
          }
        }),
        columnHelper.accessor('instructions', {
          id: 'instructions',
          header: 'Prescription / Advice',
          enableSorting: false,
          cell: ({ getValue }) => {
            const text = getValue() || ''
            const truncated =
              text.length > 70 ? `${text.slice(0, 70)}...` : text

            return (
              <div className='max-w-[320px]'>
                <p
                  className='text-xs font-normal text-foreground line-clamp-2'
                  title={text}>
                  {truncated || 'No instructions provided.'}
                </p>
              </div>
            )
          }
        }),
        columnHelper.accessor('followUpDate', {
          id: 'followUpDate',
          header: 'Follow-up Date',
          enableSorting: true,
          cell: ({ getValue }) => {
            const dateStr = getValue()
            return (
              <Badge
                variant='secondary'
                className='gap-1 font-semibold text-primary'>
                <CalendarCheck className='size-3 text-primary' />
                <span>{formatDate(dateStr)}</span>
              </Badge>
            )
          }
        }),
        columnHelper.accessor('pdfUrl', {
          id: 'pdfUrl',
          header: 'Document',
          enableSorting: false,
          cell: ({ getValue }) => {
            const pdfUrl = getValue()
            if (!pdfUrl) {
              return (
                <span className='text-xs text-muted-foreground'>No PDF</span>
              )
            }

            return (
              <a
                href={pdfUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex h-7 items-center gap-1 rounded-md border border-input bg-background px-2 text-xs font-medium hover:bg-accent hover:text-accent-foreground'>
                <Download className='size-3' /> PDF
              </a>
            )
          }
        }),
        columnHelper.accessor('createdAt', {
          id: 'createdAt',
          header: 'Issued Date',
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

  const fetchError = isError
    ? error instanceof Error
      ? error.message
      : 'Unable to load prescriptions.'
    : prescriptionsResponse?.success === false
      ? prescriptionsResponse.message
      : undefined

  return (
    <section className='mx-auto w-full max-w-[1600px] space-y-5 px-4 py-5 md:px-8 md:py-7'>
      <header className='flex flex-wrap items-end justify-between gap-4'>
        <div>
          <p className='mb-1 text-xs font-bold uppercase tracking-wider text-primary'>
            Medical Records
          </p>
          <h1 className='text-2xl font-extrabold text-foreground'>
            Prescriptions
          </h1>
          <p className='mt-1 text-sm text-muted-foreground'>
            Browse and manage all medical prescriptions issued to your
            patients.
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <div className='rounded-md border border-border bg-card px-3 py-2 text-sm text-muted-foreground shadow-2xs'>
            <span className='font-semibold tabular-nums text-foreground'>
              {allPrescriptions.length}
            </span>{' '}
            {allPrescriptions.length === 1 ? 'prescription' : 'prescriptions'}
          </div>
          <CreatePrescriptionModal />
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
        data={filteredPrescriptions}
        columns={columns}
        isLoading={isLoading}
        isFetching={isFetching}
        error={fetchError}
        onRetry={() => void refetch()}
        emptyMessage={
          searchTerm
            ? 'No prescriptions match your search.'
            : 'No prescriptions have been issued yet. Click "New Prescription" to issue one.'
        }
        sorting={{
          state: sorting,
          onSortingChange: setSorting
        }}
        pagination={{
          state: pagination,
          onPaginationChange: setPagination
        }}
        search={{
          initialValue: searchTerm,
          placeholder: 'Search by patient name, email, or instructions...',
          debounceMs: 300,
          onDebouncedChange: setSearchTerm
        }}
        actions={tableActions}
      />

      <ViewPrescriptionModal
        open={isViewDialogOpen}
        onOpenChange={onViewOpenChange}
        prescription={viewingItem}
      />

      <EditPrescriptionModal
        open={isEditModalOpen}
        onOpenChange={onEditOpenChange}
        prescription={editingItem}
      />

      <DeletePrescriptionDialog
        open={isDeleteDialogOpen}
        onOpenChange={onDeleteOpenChange}
        prescription={deletingItem}
      />
    </section>
  )
}

export default DoctorPrescriptionsTable
