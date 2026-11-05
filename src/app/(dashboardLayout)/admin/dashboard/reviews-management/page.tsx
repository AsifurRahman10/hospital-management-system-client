import ReviewsTable from '@/components/modules/dashboard/admin/ReviewsTable'
import { getReviews } from '@/service/review.service'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query'

const ReviewsManagementPage = async () => {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['reviews'],
    queryFn: getReviews,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 6
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ReviewsTable />
    </HydrationBoundary>
  )
}

export default ReviewsManagementPage
