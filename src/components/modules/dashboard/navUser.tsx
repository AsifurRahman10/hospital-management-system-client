'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar'
import { logoutAction } from '@/service/auth.service'
import {
  BadgeCheckIcon,
  ChevronsUpDownIcon,
  CreditCardIcon,
  LogOutIcon
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export function NavUser({
  user
}: {
  user: {
    name: string
    email: string
    image?: string | null
  }
}) {
  const { isMobile } = useSidebar()

  const handleLogout = async () => {
    try {
      const result = await logoutAction()

      if (!result.success) {
        toast.error(result.message || 'Logout failed')
        return
      }

      toast.success('Logged out successfully')
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'digest' in error &&
        typeof error.digest === 'string' &&
        error.digest.startsWith('NEXT_REDIRECT')
      ) {
        throw error
      }

      console.error('Logout failed:', error)
      toast.error('Logout failed')
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          {/* Base UI uses `render` instead of Radix's `asChild` */}
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size='lg'
                className='aria-expanded:bg-muted'
              />
            }>
            <Avatar className='h-8 w-8 rounded-lg'>
              <AvatarImage
                src={user?.image || undefined}
                alt={user.name}
              />
              <AvatarFallback>
                {user.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className='grid flex-1 text-left text-sm leading-tight'>
              <span className='truncate font-medium'>{user.name}</span>
              <span className='truncate text-xs text-muted-foreground'>
                {user.email}
              </span>
            </div>

            <ChevronsUpDownIcon className='ml-auto size-4' />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className='min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}>
            <DropdownMenuGroup>
              <DropdownMenuLabel className='p-0 font-normal'>
                <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                  <Avatar className='h-8 w-8 rounded-lg'>
                    <AvatarImage
                      src={user?.image || undefined}
                      alt={user.name}
                    />
                    <AvatarFallback>
                      {user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className='grid flex-1 text-left text-sm leading-tight'>
                    <span className='truncate font-medium'>{user.name}</span>
                    <span className='truncate text-xs text-muted-foreground'>
                      {user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem render={<Link href='/my-profile' />}>
                <BadgeCheckIcon className='mr-2 size-4' />
                Account
              </DropdownMenuItem>

              <DropdownMenuItem>
                <CreditCardIcon className='mr-2 size-4' />
                Billing
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              {/* Base UI uses onClick, not Radix's onSelect */}
              <DropdownMenuItem
                onClick={handleLogout}
                className='cursor-pointer text-destructive focus:text-destructive'>
                <LogOutIcon className='mr-2 size-4' />
                Logout
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
