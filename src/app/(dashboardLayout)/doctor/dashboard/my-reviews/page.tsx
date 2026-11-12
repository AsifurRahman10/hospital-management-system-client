import DoctorReviewsTable from '@/components/modules/dashboard/doctor/DoctorReviewsTable'
import { getMyReviews } from '@/service/review.service'
import { buildQueryString } from '@/utils/queryStringUtils'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query'

const MyReviewsPage = async ({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const queryParamsObjects = await searchParams
  const queryString = buildQueryString(queryParamsObjects)

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['my-reviews', queryString],
    queryFn: () => getMyReviews(queryString),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 6
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DoctorReviewsTable />
    </HydrationBoundary>
  )
}

export default MyReviewsPage
