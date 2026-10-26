import Link from 'next/link'
import { ArrowUpRight, Plus } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'

const navigation = [
  { href: '#about', label: 'About us' },
  { href: '#services', label: 'Services' },
  { href: '#contact', label: 'Contacts' }
]

export function SiteHeader() {
  return (
    <header className='mx-auto flex min-h-[82px] w-full max-w-[1200px] items-center justify-between gap-2 px-4 md:gap-4 md:px-[5%] lg:px-[60px]'>
      <Link
        href='#top'
        aria-label='Duozhuamiao Dental home'
        className='inline-flex shrink-0 items-center gap-2 text-[15px] font-extrabold text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary'>
        <span className='grid size-8 place-items-center rounded-sm bg-primary text-white'>
          <Plus
            size={20}
            strokeWidth={2.5}
            aria-hidden='true'
          />
        </span>
        <span>Duozhuamiao</span>
      </Link>
      <nav
        aria-label='Main navigation'
        className='hidden items-center gap-7 md:flex'>
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className='text-sm font-medium text-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary'>
            {item.label}
          </Link>
        ))}
      </nav>
      <Link
        href='#contact'
        className={buttonVariants({
          className:
            'h-[42px] shrink-0 rounded-sm border border-primary bg-transparent px-3 text-xs font-bold text-primary hover:bg-primary hover:text-white sm:px-4 sm:text-sm'
        })}>
        <span className='sm:hidden'>Appointment</span>
        <span className='hidden sm:inline'>Make appointment</span>
        <ArrowUpRight aria-hidden='true' />
      </Link>
    </header>
  )
}
