import DoctorSchedulesTable from '@/components/modules/dashboard/admin/DoctorSchedulesTable'
import { getDoctors } from '@/service/doctor.service'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query'

const DoctorSchedulesManagementPage = async () => {
  const queryClient = new QueryClient()

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
