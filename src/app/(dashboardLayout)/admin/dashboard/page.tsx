import { getStats } from '@/service/dashboard.service'
import { QueryClient } from '@tanstack/react-query'

const AdminDashboardPage = async () => {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['admin-dashboard-data'],
    queryFn: getStats,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000
  })
  return <div>AdminDashboardPage</div>
}

export default AdminDashboardPage
