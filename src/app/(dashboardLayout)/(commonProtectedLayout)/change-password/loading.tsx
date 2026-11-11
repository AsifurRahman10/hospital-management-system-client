import { Skeleton } from '@/components/ui/skeleton'

export default function ChangePasswordLoading() {
  return (
    <div className='mx-auto max-w-2xl space-y-6 px-4 py-8 md:py-12'>
      <div className='space-y-2'>
        <Skeleton className='h-8 w-48 rounded-lg' />
        <Skeleton className='h-4 w-72 rounded-md' />
      </div>
      <div className='rounded-2xl border border-border/80 bg-card p-6 shadow-xs space-y-5 sm:p-8'>
        <Skeleton className='h-11 w-full rounded-xl' />
        <Skeleton className='h-11 w-full rounded-xl' />
        <Skeleton className='h-11 w-full rounded-xl' />
        <Skeleton className='h-11 w-32 rounded-xl' />
      </div>
    </div>
  )
}
