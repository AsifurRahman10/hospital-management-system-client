import DashboardBreadcrumb from '@/components/modules/dashboard/DashboardBreadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { BellIcon, SearchIcon } from 'lucide-react'

const DashboardNavbar = () => {
  return (
    <header className='flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border/70 bg-background/80 px-4 backdrop-blur transition-[width,height] ease-linear md:px-8'>
      <div className='flex items-center gap-2'>
        <SidebarTrigger className='-ml-1' />
        <Separator
          orientation='vertical'
          className='mr-2 data-[orientation=vertical]:h-4'
        />
        <DashboardBreadcrumb />
      </div>
      <div className='flex items-center gap-2'>
        <button
          className='hidden h-9 items-center gap-2 rounded-md border border-border bg-card px-3 text-xs text-muted-foreground transition-colors hover:bg-muted sm:flex'
          type='button'>
          <SearchIcon className='size-3.5' />
          Search workspace
          <span className='ml-5 rounded border border-border px-1.5 py-0.5 text-[10px]'>
            Cmd K
          </span>
        </button>
        <button
          className='grid size-9 place-items-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:bg-muted'
          type='button'
          aria-label='View notifications'>
          <BellIcon className='size-4' />
        </button>
      </div>
    </header>
  )
}

export default DashboardNavbar
