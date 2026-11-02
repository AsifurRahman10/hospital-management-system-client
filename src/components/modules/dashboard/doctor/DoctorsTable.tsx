'use client'

import DateCell from '@/components/modules/dashboard/DateCell'
import StatusBadgeCell from '@/components/modules/dashboard/StatusBadgeCell'
import UserInfoCell from '@/components/modules/dashboard/UserInfoCell'
import DataTable from '@/components/shared/DataTable'
import { Badge } from '@/components/ui/badge'
import { getDoctors } from '@/service/doctor.service'
import { IDoctor } from '@/types/doctor.types'
import { useQuery } from '@tanstack/react-query'
import { createColumnHelper, tableFeatures } from '@tanstack/react-table'
import { Star } from 'lucide-react'

const DoctorsTable = () => {
  type TableFeatures = ReturnType<typeof tableFeatures>
  const columnHelper = createColumnHelper<TableFeatures, IDoctor>()

  const doctorColumns = columnHelper.columns([
    columnHelper.accessor('name', {
      header: 'name',
      cell: ({ row }) => (
        <UserInfoCell
          name={row.original.name}
          email={row.original.email}
          profilePhoto={row.original.profilePhoto}
        />
      )
    }),
    columnHelper.accessor('specialties', {
      header: 'Specialties',
      cell: ({ getValue }) => {
        const specialties = getValue()

        if (!specialties?.length) {
          return (
            <span className='text-xs text-muted-foreground'>
              No Specialties
            </span>
          )
        }

        return (
          <div className='flex flex-wrap gap-1'>
            {specialties.map(({ specialty }, index) => (
              <Badge
                key={specialty.id ?? index}
                variant='secondary'>
                {specialty.title || 'N/A'}
              </Badge>
            ))}
          </div>
        )
      }
    }),
    columnHelper.accessor('contactNumber', {
      header: 'Contact Number',
      cell: ({ getValue }) => (
        <span className='text-sm'>{getValue() || 'N/A'}</span>
      )
    }),
    columnHelper.accessor('experience', {
      header: 'Experience',
      cell: ({ getValue }) => (
        <span className='text-sm font-medium'>{getValue() ?? 0} years</span>
      )
    }),
    columnHelper.accessor('appointmentFee', {
      header: 'Fee',
      cell: ({ getValue }) => {
        const fee = getValue()

        return (
          <span className='text-sm font-semibold text-green-600'>
            {fee != null ? `$${fee.toFixed(2)}` : 'N/A'}
          </span>
        )
      }
    }),
    columnHelper.accessor('averageRating', {
      header: 'Rating',
      cell: ({ getValue }) => (
        <div className='flex items-center gap-1'>
          <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
          <span className='text-sm font-medium'>
            {getValue()?.toFixed(1) ?? '0.0'}
          </span>
        </div>
      )
    }),
    columnHelper.accessor('gender', {
      header: 'Gender',
      cell: ({ getValue }) => (
        <span className='text-sm capitalize'>
          {getValue()?.toLowerCase() ?? 'N/A'}
        </span>
      )
    }),
    columnHelper.accessor((row) => row.user?.status, {
      id: 'status',
      header: 'Status',
      cell: ({ getValue }) => <StatusBadgeCell status={getValue()} />
    }),
    columnHelper.accessor('createdAt', {
      header: 'Joined On',
      cell: ({ getValue }) => (
        <DateCell
          date={getValue()}
          formatString='MMM dd, yyyy'
        />
      )
    })
  ])

  const { data: doctorDataResponse, isLoading } = useQuery({
    queryKey: ['doctors'],
    queryFn: getDoctors
  })

  const handleView = (doctor: IDoctor) => {
    console.log('View doctor:', doctor)
  }

  const handleEdit = (doctor: IDoctor) => {
    console.log('Edit doctor:', doctor)
  }

  const handleDelete = (doctor: IDoctor) => {
    console.log('Delete doctor:', doctor)
  }

  const doctors = doctorDataResponse?.data?.data ?? []
  return (
    <DataTable
      data={doctors}
      columns={doctorColumns}
      isLoading={isLoading}
      emptyMessage='No doctors found.'
      actions={{
        onView: handleView,
        onEdit: handleEdit,
        onDelete: handleDelete
      }}
    />
  )
}

export default DoctorsTable
