import PrescriptionsTable from '@/components/modules/dashboard/admin/PrescriptionsTable'
import { getPrescriptions } from '@/service/prescription.service'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query'

const PrescriptionsManagementPage = async () => {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['prescriptions'],
    queryFn: () => getPrescriptions(),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 6
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PrescriptionsTable />
    </HydrationBoundary>
  )
}

export default PrescriptionsManagementPage
