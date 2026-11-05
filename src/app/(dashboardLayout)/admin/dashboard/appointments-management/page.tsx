import AppointmentTable from '@/components/modules/dashboard/admin/AppointmentTable'
import { getAppointments } from '@/service/appointment.service'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query'

const AppointmentManagementPage = async ({
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
    queryKey: ['appointments', queryString],
    queryFn: () => getAppointments(queryString),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 6 // 6 hours
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AppointmentTable />
    </HydrationBoundary>
  )
}

export default AppointmentManagementPage
