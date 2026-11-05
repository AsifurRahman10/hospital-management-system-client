import DoctorsTable from '@/components/modules/dashboard/doctor/DoctorsTable'
import { getAllSpecialties, getDoctors } from '@/service/doctor.service'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query'

const DoctorManagementPage = async ({
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
          .map((v) => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`)
          .join('&')
      }

      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    })
    .filter(Boolean)
    .join('&')

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['doctors', queryString],
    queryFn: () => getDoctors(queryString),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 6 // 6 hours
  })

  await queryClient.prefetchQuery({
    queryKey: ['specialties'],
    queryFn: () => getAllSpecialties(),
    staleTime: 1000 * 60 * 60 * 6, // 6 hours
    gcTime: 1000 * 60 * 60 * 24 // 24 hours
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DoctorsTable />
    </HydrationBoundary>
  )
}

export default DoctorManagementPage
