import DoctorDashboardContent from '@/components/modules/dashboard/doctor/DoctorDashboardContent'
import { getStats } from '@/service/dashboard.service'
import { requireUser } from '@/app/lib/session'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query'

const DoctorDashboardPage = async () => {
  const userInfo = await requireUser()
  const user = userInfo?.data?.user ?? userInfo?.data ?? userInfo

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['doctor-dashboard-data'],
    queryFn: getStats,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DoctorDashboardContent user={user} />
    </HydrationBoundary>
  )
}

export default DoctorDashboardPage
