import SpecialtiesTable from '@/components/modules/dashboard/admin/SpecialtiesTable'
import { getSpecialties } from '@/service/specialty.service'
import { buildQueryString } from '@/utils/queryStringUtils'
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
  const queryString = buildQueryString(queryParamsObjects)

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
