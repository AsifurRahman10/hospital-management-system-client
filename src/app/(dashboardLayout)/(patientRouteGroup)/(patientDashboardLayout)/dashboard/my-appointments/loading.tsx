import { Skeleton } from '@/components/ui/skeleton'

const MyAppointmentsLoading = () => {
  return (
    <section className='mx-auto w-full max-w-[1600px] space-y-5 px-4 py-5 md:px-8 md:py-7'>
      <div className='flex flex-wrap items-end justify-between gap-4'>
        <div className='space-y-2'>
          <Skeleton className='h-4 w-28' />
          <Skeleton className='h-8 w-52' />
          <Skeleton className='h-4 w-80' />
        </div>
        <div className='flex gap-3'>
          <Skeleton className='h-9 w-28 rounded-md' />
          <Skeleton className='h-9 w-36 rounded-md' />
        </div>
      </div>

      <div className='rounded-xl border border-border/70 bg-card p-4 space-y-4 shadow-xs'>
        <div className='flex justify-between items-center'>
          <Skeleton className='h-9 w-64' />
          <Skeleton className='h-9 w-32' />
        </div>
        <div className='space-y-3 pt-2'>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              key={i}
              className='h-12 w-full rounded-md'
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default MyAppointmentsLoading
