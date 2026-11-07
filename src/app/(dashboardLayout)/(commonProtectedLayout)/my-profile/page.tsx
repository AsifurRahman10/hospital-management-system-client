import { ProfileView } from '@/components/modules/dashboard/profile/ProfileView'
import { getAllSpecialties } from '@/service/doctor.service'
import { getMe } from '@/service/profile.service'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query'

const MyProfilePage = async () => {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['my-profile'],
    queryFn: getMe,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 6
  })

  await queryClient.prefetchQuery({
    queryKey: ['specialties'],
    queryFn: getAllSpecialties,
    staleTime: 1000 * 60 * 60 * 6,
    gcTime: 1000 * 60 * 60 * 24
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfileView />
    </HydrationBoundary>
  )
}

export default MyProfilePage
