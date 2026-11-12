import { Skeleton } from '@/components/ui/skeleton'

export default function DoctorDetailsLoading() {
  return (
    <div className='w-full pt-4'>
      <div className='container-custom space-y-8'>
        {/* Doctor Header Showcase Card Skeleton */}
        <div className='overflow-hidden rounded-xl border border-border/80 bg-card p-6 shadow-xs sm:p-8'>
          <div className='flex flex-col gap-6 md:flex-row md:items-center'>
            <Skeleton className='size-52 shrink-0 rounded-2xl md:size-60' />
            <div className='flex-1 space-y-4'>
              <Skeleton className='h-8 w-64 rounded-lg' />
              <div className='flex gap-2'>
                <Skeleton className='h-6 w-32 rounded-full' />
                <Skeleton className='h-6 w-24 rounded-full' />
              </div>
              <Skeleton className='h-20 w-full rounded-xl' />
              <div className='flex gap-4 pt-2'>
                <Skeleton className='h-10 w-36 rounded-xl' />
                <Skeleton className='h-10 w-36 rounded-xl' />
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Details & Schedule Grid Skeleton */}
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          <div className='space-y-6 lg:col-span-2'>
            <Skeleton className='h-96 w-full rounded-2xl' />
          </div>
          <div className='space-y-6'>
            <Skeleton className='h-96 w-full rounded-2xl' />
          </div>
        </div>
      </div>
    </div>
  )
}
