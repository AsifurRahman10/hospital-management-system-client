import DoctorsTable from '@/components/modules/dashboard/doctor/DoctorsTable'
import { getDoctors } from '@/service/doctor.service'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query'

const AdminDoctorManagement = async () => {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['doctors'],
    queryFn: getDoctors,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 6
  })
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DoctorsTable />
    </HydrationBoundary>
  )
}

export default AdminDoctorManagement
