'use client'

import DateCell from '@/components/modules/dashboard/DateCell'
import UserInfoCell from '@/components/modules/dashboard/UserInfoCell'
import DataTable from '@/components/shared/DataTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getMyPrescriptions } from '@/service/prescription.service'
import { IPrescription } from '@/types/prescription.type'
import { useQuery } from '@tanstack/react-query'
import { createColumnHelper, tableFeatures } from '@tanstack/react-table'
import { format } from 'date-fns'
import { CalendarCheck, Download, RotateCcw } from 'lucide-react'
import { useMemo } from 'react'

const formatDate = (dateStr?: string | Date) => {
  if (!dateStr) return 'N/A'
  try {
    const d = new Date(dateStr)
    return Number.isNaN(d.getTime()) ? 'N/A' : format(d, 'MMM dd, yyyy')
  } catch {
    return 'N/A'
  }
}

const PatientPrescriptionsTable = () => {
  type TableFeatures = ReturnType<typeof tableFeatures>
  const columnHelper = createColumnHelper<TableFeatures, IPrescription>()

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

  const columns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor('doctor', {
          id: 'doctor',
          header: 'Doctor',
          enableSorting: false,
          cell: ({ row }) => {
            const doctor = row.original.doctor
            return (
              <UserInfoCell
                name={doctor?.name ? `Dr. ${doctor.name}` : 'Assigned Doctor'}
                email={doctor?.email || 'N/A'}
                profilePhoto={doctor?.profilePhoto || undefined}
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
            return (
              <div className='max-w-[360px]'>
                <p
                  className='text-xs font-normal text-foreground line-clamp-2'
                  title={text}>
                  {text || 'No instructions provided.'}
                </p>
              </div>
            )
          }
        }),
        columnHelper.accessor('followUpDate', {
          id: 'followUpDate',
          header: 'Follow-up Date',
          enableSorting: false,
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
          enableSorting: false,
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
            My Prescriptions
          </h1>
          <p className='mt-1 text-sm text-muted-foreground'>
            Review all medical prescriptions and doctor recommendations from your consultations.
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <div className='rounded-md border border-border bg-card px-3 py-2 text-sm text-muted-foreground shadow-2xs'>
            <span className='font-semibold tabular-nums text-foreground'>
              {allPrescriptions.length}
            </span>{' '}
            {allPrescriptions.length === 1 ? 'prescription' : 'prescriptions'}
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
        data={allPrescriptions}
        columns={columns}
        isLoading={isLoading}
        isFetching={isFetching}
        error={fetchError}
        onRetry={() => void refetch()}
        emptyMessage='You have not received any prescriptions yet.'
      />
    </section>
  )
}

export default PatientPrescriptionsTable
