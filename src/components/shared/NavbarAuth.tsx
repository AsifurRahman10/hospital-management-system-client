'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
import { logoutAction } from '@/service/auth.service'
import { LogOut, LayoutDashboard } from 'lucide-react'

interface NavbarAuthProps {
  user?: {
    name: string
    image?: string | null
  } | null
}

export function NavbarAuth({ user }: NavbarAuthProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await logoutAction()
    router.refresh()
    router.push('/login')
  }

  if (!user) {
    return (
      <Link
        href='/login'
        className='text-sm font-semibold text-primary'>
        Login
      </Link>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button className='rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring'>
            <Avatar className='h-9 w-9 cursor-pointer'>
              <AvatarImage
                src={user.image ?? undefined}
                alt={user.name}
              />
              <AvatarFallback>
                {user.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </button>
        }
      />
      <DropdownMenuContent
        align='end'
        className='w-56'>
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <p className='font-bold text-black'>{user.name}</p>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          render={
            <Link href='/dashboard'>
              <LayoutDashboard className='mr-2 h-4 w-4' />
              Dashboard
            </Link>
          }></DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className='cursor-pointer text-destructive focus:text-destructive'>
          <LogOut className='mr-2 h-4 w-4' />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
