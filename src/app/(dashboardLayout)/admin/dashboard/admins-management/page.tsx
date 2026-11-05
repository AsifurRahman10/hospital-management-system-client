import AdminTable from '@/components/modules/dashboard/admin/AdminTable'
import { getAdmins } from '@/service/admin.service'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query'

const AdminsManagementPage = async () => {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['admins'],
    queryFn: getAdmins,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 6 // 6 hours
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminTable />
    </HydrationBoundary>
  )
}

export default AdminsManagementPage
