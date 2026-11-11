import DoctorDirectory, {
  DoctorDirectorySkeleton
} from '@/components/modules/storeFront/DoctorDirectory'
import { getAllSpecialties, getDoctors } from '@/service/doctor.service'
import { buildQueryString } from '@/utils/queryStringUtils'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query'
import { Suspense } from 'react'

interface DoctorsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function DoctorDirectoryData({ searchParams }: DoctorsPageProps) {
  const queryParamsObjects = await searchParams
  const queryString = buildQueryString(queryParamsObjects)

  const queryClient = new QueryClient()

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['doctors', queryString],
      queryFn: () => getDoctors(queryString),
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30
    }),
    queryClient.prefetchQuery({
      queryKey: ['specialties'],
      queryFn: () => getAllSpecialties(),
      staleTime: 1000 * 60 * 60,
      gcTime: 1000 * 60 * 60 * 6
    })
  ])

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DoctorDirectory />
    </HydrationBoundary>
  )
}

const DoctorsPage = ({ searchParams }: DoctorsPageProps) => {
  return (
    <div className='min-h-screen container-custom  bg-background font-sans text-foreground antialiased selection:bg-primary/10 selection:text-primary'>
      <main id='main-content'>
        <Suspense fallback={<DoctorDirectorySkeleton />}>
          <DoctorDirectoryData searchParams={searchParams} />
        </Suspense>
      </main>
    </div>
  )
}

export default DoctorsPage
