import { Plus } from 'lucide-react'

export default function GlobalLoading() {
  return (
    <div className='fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-xs'>
      <div className='relative flex items-center justify-center'>
        <div className='size-14 animate-spin rounded-full border-3 border-primary/20 border-t-primary' />
        <div className='absolute grid size-8 place-items-center rounded-sm bg-primary text-white shadow-xs'>
          <Plus
            size={20}
            strokeWidth={2.5}
            aria-hidden='true'
          />
        </div>
      </div>
      <p className='mt-4 text-xs font-bold uppercase tracking-wider text-muted-foreground animate-pulse'>
        Loading Life Hospital...
      </p>
    </div>
  )
}
