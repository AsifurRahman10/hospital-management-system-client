import AdminDashboardContent from '@/components/modules/dashboard/admin/AdminDashboardContent'
import { getStats } from '@/service/dashboard.service'
import { requireUser } from '@/app/lib/session'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query'

const AdminDashboardPage = async () => {
  const userInfo = await requireUser()
  const user = userInfo?.data?.user ?? userInfo?.data ?? userInfo

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['admin-dashboard-data'],
    queryFn: getStats,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000
  })
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminDashboardContent user={user} />
    </HydrationBoundary>
  )
}

export default AdminDashboardPage
