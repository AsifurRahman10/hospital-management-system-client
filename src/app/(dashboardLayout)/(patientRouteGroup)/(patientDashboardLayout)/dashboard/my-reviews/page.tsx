import PatientReviewsTable from '@/components/modules/dashboard/patient/PatientReviewsTable'
import { getMyReviews } from '@/service/review.service'
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

  const serializeKey = (key: string) =>
    encodeURIComponent(key).replace(/%5B/g, '[').replace(/%5D/g, ']')

  const queryString = Object.keys(queryParamsObjects)
    .map((key) => {
      const value = queryParamsObjects[key]
      if (value === undefined) {
        return ''
      }

      if (Array.isArray(value)) {
        return value
          .map((item) => `${serializeKey(key)}=${encodeURIComponent(item)}`)
          .join('&')
      }

      return `${serializeKey(key)}=${encodeURIComponent(value)}`
    })
    .filter(Boolean)
    .join('&')

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
