import { Plus } from 'lucide-react'

export default function StorefrontLoading() {
  return (
    <div className='min-h-[60vh] w-full flex flex-col items-center justify-center py-20'>
      <div className='relative flex items-center justify-center'>
        <div className='size-12 animate-spin rounded-full border-3 border-primary/20 border-t-primary' />
        <div className='absolute grid size-7 place-items-center rounded-sm bg-primary text-white shadow-xs'>
          <Plus
            size={18}
            strokeWidth={2.5}
            aria-hidden='true'
          />
        </div>
      </div>
      <p className='mt-3 text-xs font-semibold text-muted-foreground animate-pulse'>
        Loading page...
      </p>
    </div>
  )
}
