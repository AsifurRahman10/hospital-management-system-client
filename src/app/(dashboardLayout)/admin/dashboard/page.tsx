import AdminDashboardContent from '@/components/modules/dashboard/admin/AdminDashboardContent'
import { getStats } from '@/service/dashboard.service'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query'

const AdminDashboardPage = async () => {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['admin-dashboard-data'],
    queryFn: getStats,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000
  })
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminDashboardContent />
    </HydrationBoundary>
  )
}

export default AdminDashboardPage
