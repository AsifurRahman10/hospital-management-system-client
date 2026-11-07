import DoctorSchedulesTable from '@/components/modules/dashboard/admin/DoctorSchedulesTable'
import { getDoctorWiseSchedules } from '@/service/doctorSchedule.service'
import { getDoctors } from '@/service/doctor.service'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query'

const DoctorSchedulesManagementPage = async ({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const queryParamsObjects = await searchParams

  const queryString = Object.keys(queryParamsObjects)
    .map((key) => {
      const value = queryParamsObjects[key]
      if (value === undefined) {
        return ''
      }

      if (Array.isArray(value)) {
        return value
          .map((v) => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`)
          .join('&')
      }

      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    })
    .filter(Boolean)
    .join('&')

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['doctor-schedules', queryString],
    queryFn: () => getDoctorWiseSchedules(queryString),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 6 // 6 hours
  })

  await queryClient.prefetchQuery({
    queryKey: ['doctors-list'],
    queryFn: () => getDoctors('limit=100'),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 6 // 6 hours
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DoctorSchedulesTable />
    </HydrationBoundary>
  )
}

export default DoctorSchedulesManagementPage
