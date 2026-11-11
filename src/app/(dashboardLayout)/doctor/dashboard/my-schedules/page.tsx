import MyDoctorSchedulesTable from '@/components/modules/dashboard/doctor/MyDoctorSchedulesTable'
import { getDoctorWiseSchedules } from '@/service/doctorSchedule.service'
import { buildQueryString } from '@/utils/queryStringUtils'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query'

const MySchedulesPage = async ({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const queryParamsObjects = await searchParams
  const queryString = buildQueryString(queryParamsObjects)

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['doctor-wise-schedules', queryString],
    queryFn: () => getDoctorWiseSchedules(queryString),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 6
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MyDoctorSchedulesTable />
    </HydrationBoundary>
  )
}

export default MySchedulesPage
