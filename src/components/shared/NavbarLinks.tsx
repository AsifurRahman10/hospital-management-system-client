'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowUpRight, Menu, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import CustomButton from '@/components/shared/CustomButton'

const navigation = [
  { href: '/', label: 'Home' },
  { href: '/doctors', label: 'Doctors' },
  { href: '/about', label: 'About us' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contacts' }
]

const isRouteActive = (pathname: string, href: string) => {
  const normalizedPathname = pathname.replace(/\/$/, '') || '/'
  return (
    normalizedPathname === href ||
    (href !== '/' && normalizedPathname.startsWith(`${href}/`))
  )
}

export function NavbarLinks() {
  const pathname = usePathname()

  return (
    <nav
      aria-label='Main navigation'
      className='hidden items-center gap-7 md:flex'>
      {navigation.map((item) => {
        const isActive = isRouteActive(pathname, item.href)

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            className={`text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary ${
              isActive
                ? 'font-semibold text-primary'
                : 'font-medium text-foreground hover:text-primary'
            }`}>
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

export function MobileNavbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='md:hidden'
            aria-label='Open navigation menu'
          />
        }>
        <Menu
          className='size-5'
          aria-hidden='true'
        />
      </SheetTrigger>
      <SheetContent
        side='right'
        className='w-72 p-0 md:hidden'>
        <SheetHeader className='border-b border-border/70 px-5 py-4'>
          <SheetTitle className='flex items-center gap-2 text-[15px] font-extrabold text-foreground'>
            <span className='grid size-7 place-items-center rounded-sm bg-primary text-white'>
              <Plus
                size={16}
                strokeWidth={2.5}
                aria-hidden='true'
              />
            </span>
            <span>Life Hospital</span>
          </SheetTitle>
        </SheetHeader>

        <nav
          aria-label='Mobile navigation'
          className='flex flex-col gap-1 p-4'>
          {navigation.map((item) => {
            const isActive = isRouteActive(pathname, item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={isActive ? 'page' : undefined}
                className={`rounded-md px-3 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-primary/10 font-semibold text-primary'
                    : 'font-medium text-foreground hover:bg-muted hover:text-primary'
                }`}>
                {item.label}
              </Link>
            )
          })}
        </nav>

        <SheetFooter className='border-t border-border/70 p-4'>
          <CustomButton
            href='/doctors'
            onClick={() => setOpen(false)}
            className='w-full justify-center'
            text='Make appointment'
            icon={<ArrowUpRight className='size-4' />}
          />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
