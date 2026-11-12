import PatientReviewsTable from '@/components/modules/dashboard/patient/PatientReviewsTable'
import { getMyReviews } from '@/service/review.service'
import { buildQueryString } from '@/utils/queryStringUtils'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query'

const PatientReviewsPage = async ({
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
      <PatientReviewsTable />
    </HydrationBoundary>
  )
}

export default PatientReviewsPage
