import PatientAppointmentsTable from '@/components/modules/dashboard/patient/PatientAppointmentsTable'
import { getMyAppointments } from '@/service/appointment.service'
import { buildQueryString } from '@/utils/queryStringUtils'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query'

const MyAppointmentsPage = async ({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const queryParamsObjects = await searchParams
  const queryString = buildQueryString(queryParamsObjects)

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['my-appointments', queryString],
    queryFn: () => getMyAppointments(queryString),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 6
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PatientAppointmentsTable />
    </HydrationBoundary>
  )
}

export default MyAppointmentsPage
