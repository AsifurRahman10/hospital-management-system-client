import { Skeleton } from '@/components/ui/skeleton'

export const DashboardOverviewSkeleton = ({
  cards = 4,
  charts = 2
}: {
  cards?: number
  charts?: number
}) => {
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

        <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
          {Array.from({ length: cards }).map((_, i) => (
            <Skeleton
              key={i}
              className='h-28 rounded-lg'
            />
          ))}
        </div>

        <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
          {Array.from({ length: charts }).map((_, i) => (
            <Skeleton
              key={i}
              className='h-72 rounded-lg'
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export const TableManagementSkeleton = () => {
  return (
    <section className='mx-auto w-full max-w-[1600px] space-y-5 px-4 py-5 md:px-8 md:py-7'>
      <div className='flex flex-wrap items-end justify-between gap-4'>
        <div className='space-y-2'>
          <Skeleton className='h-4 w-28' />
          <Skeleton className='h-8 w-56' />
          <Skeleton className='h-4 w-80' />
        </div>
        <div className='flex gap-3'>
          <Skeleton className='h-9 w-32 rounded-md' />
        </div>
      </div>

      <div className='space-y-4 rounded-xl border border-border/70 bg-card p-4 shadow-xs'>
        <div className='flex items-center justify-between'>
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
