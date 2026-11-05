import SpecialtiesTable from '@/components/modules/dashboard/admin/SpecialtiesTable'
import { getSpecialties } from '@/service/specialty.service'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query'

const SpecialtiesManagementPage = async ({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const queryParamsObjects = await searchParams

  const queryString = Object.keys(queryParamsObjects)
    .map((key) => {
      const value = queryParamsObjects[key]
      if (value === undefined) {
        return ''
      }

      if (Array.isArray(value)) {
        return value
          .map(
            (item) => `${encodeURIComponent(key)}=${encodeURIComponent(item)}`
          )
          .join('&')
      }

      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    })
    .filter(Boolean)
    .join('&')

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['specialties', queryString],
    queryFn: () => getSpecialties(queryString),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 6
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SpecialtiesTable />
    </HydrationBoundary>
  )
}

export default SpecialtiesManagementPage
