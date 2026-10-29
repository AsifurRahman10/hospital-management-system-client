import { ChevronRightIcon } from 'lucide-react'

export function AttentionItem({
  title,
  detail,
  color
}: {
  title: string
  detail: string
  color: string
}) {
  return (
    <button
      className='flex w-full items-center gap-3 rounded-md border border-transparent p-2 text-left transition-colors hover:border-border hover:bg-muted/50'
      type='button'>
      <span className={`size-2.5 shrink-0 rounded-full ${color}`} />
      <span className='min-w-0 flex-1'>
        <span className='block truncate text-sm font-semibold'>{title}</span>
        <span className='mt-0.5 block truncate text-xs text-muted-foreground'>
          {detail}
        </span>
      </span>
      <ChevronRightIcon className='size-4 shrink-0 text-muted-foreground' />
    </button>
  )
}
