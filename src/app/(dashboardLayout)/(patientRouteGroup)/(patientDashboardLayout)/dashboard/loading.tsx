import { Skeleton } from '@/components/ui/skeleton'

const PatientDashboardLoading = () => {
  return (
    <div className='min-h-full bg-background px-4 py-6 md:px-8 md:py-8'>
      <div className='mx-auto flex w-full max-w-[1480px] flex-col gap-7'>
        <div className='flex items-center justify-between'>
          <div className='space-y-2'>
            <Skeleton className='h-8 w-48' />
            <Skeleton className='h-4 w-72' />
          </div>
          <Skeleton className='h-10 w-36 rounded-md' />
        </div>

        <div className='grid gap-4 sm:grid-cols-2'>
          <Skeleton className='h-28 rounded-lg' />
          <Skeleton className='h-28 rounded-lg' />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          <Skeleton className='h-72 rounded-lg' />
        </div>
      </div>
    </div>
  )
}

export default PatientDashboardLoading
