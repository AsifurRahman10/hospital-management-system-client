import PatientPrescriptionsTable from '@/components/modules/dashboard/patient/PatientPrescriptionsTable'
import { getMyPrescriptions } from '@/service/prescription.service'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query'

const MyPrescriptionsPage = async () => {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['my-prescriptions'],
    queryFn: () => getMyPrescriptions(),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 6
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PatientPrescriptionsTable />
    </HydrationBoundary>
  )
}

export default MyPrescriptionsPage
