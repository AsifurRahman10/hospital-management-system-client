import DoctorProfilePage from '@/components/modules/dashboard/admin/DoctorProfilePage'
import { getDoctorById } from '@/service/doctor.service'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query'
import { Suspense } from 'react'

const DoctorDetailsLoading = () => (
  <section className='mx-auto w-full max-w-350 px-4 py-6 md:px-8'>
    <div className='animate-pulse space-y-5'>
      <div className='h-8 w-40 rounded bg-muted' />
      <div className='h-64 rounded-2xl bg-muted' />
      <div className='grid gap-5 lg:grid-cols-3'>
        <div className='h-72 rounded-xl bg-muted lg:col-span-2' />
        <div className='h-72 rounded-xl bg-muted' />
      </div>
    </div>
  </section>
)

const DoctorDetailsContent = async ({
  params
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params
  const queryClient = new QueryClient()
  await queryClient.query({
    queryKey: ['doctor-details', id],
    queryFn: () => getDoctorById(id),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 6
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DoctorProfilePage doctorId={id} />
    </HydrationBoundary>
  )
}

const DoctorDetailsRoute = async ({
  params
}: {
  params: Promise<{ id: string }>
}) => {
  return (
    <Suspense fallback={<DoctorDetailsLoading />}>
      <DoctorDetailsContent params={params} />
    </Suspense>
  )
}

export default DoctorDetailsRoute
