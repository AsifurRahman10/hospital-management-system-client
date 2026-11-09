import PatientDashboardContent from '@/components/modules/dashboard/patient/PatientDashboardContent'
import { getStats } from '@/service/dashboard.service'
import { requireUser } from '@/app/lib/session'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query'

const PatientDashboardPage = async () => {
  const userInfo = await requireUser()
  const user = userInfo?.data?.user ?? userInfo?.data ?? userInfo

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['patient-dashboard-data'],
    queryFn: getStats,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PatientDashboardContent user={user} />
    </HydrationBoundary>
  )
}

export default PatientDashboardPage
