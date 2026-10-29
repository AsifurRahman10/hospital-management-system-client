import * as React from 'react'

import { SidebarNavList } from '@/components/modules/dashboard/SidebarNavList'
import { NavUser } from '@/components/modules/dashboard/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail
} from '@/components/ui/sidebar'
import { Plus, StethoscopeIcon } from 'lucide-react'
import { NavSection } from '@/types/dashboard.type'
import { getNavItemsByRole } from '@/app/lib/navList'
import { verifyUserWithToken } from '@/service/auth.service'
import { UserRole } from '@/utils/authUtils'

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const userInfo = await verifyUserWithToken()
  const user = userInfo?.data ?? userInfo
  const role = user?.role as UserRole | undefined
  const navItems: NavSection[] = role ? getNavItemsByRole(role) : []

  const sidebarUser = {
    name: user?.name ?? 'Life.care user',
    email: user?.email ?? '',
    avatar: user?.image ?? ''
  }
  return (
    <Sidebar
      collapsible='icon'
      {...props}>
      <SidebarHeader className='p-4 pb-2'>
        <div className='inline-flex shrink-0 items-center gap-2 text-[15px] font-extrabold text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary'>
          <span className='grid size-8 place-items-center rounded-sm bg-primary text-white'>
            <Plus
              size={20}
              strokeWidth={2.5}
              aria-hidden='true'
            />
          </span>
          <span>
            Life<span className='text-primary'>.</span>care
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarNavList items={navItems} />
        <div className='mt-auto px-4 pb-4 group-data-[collapsible=icon]:hidden'>
          <div className='rounded-md border border-primary/15 bg-secondary/60 p-3'>
            <div className='mb-2 flex items-center gap-2 text-xs font-semibold text-secondary-foreground'>
              <StethoscopeIcon className='size-3.5' />
              Care team status
            </div>
            <div className='flex items-center gap-2 text-xs text-muted-foreground'>
              <span className='size-2 rounded-full bg-accent' />
              All systems operational
            </div>
          </div>
        </div>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
