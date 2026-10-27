import Link from 'next/link'
import { ArrowUpRight, Plus } from 'lucide-react'
import CustomButton from '@/components/shared/CustomButton'

const navigation = [
  { href: '#about', label: 'About us' },
  { href: '#services', label: 'Services' },
  { href: '#contact', label: 'Contacts' }
]

export function Navbar() {
  return (
    <header className='mx-auto flex min-h-20.5 w-full max-w-3/4 items-center justify-between gap-2 px-4 md:gap-4 md:px-[5%] lg:px-[60px]'>
      <Link
        href='#top'
        aria-label='Life Hospital home'
        className='inline-flex shrink-0 items-center gap-2 text-[15px] font-extrabold text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary'>
        <span className='grid size-8 place-items-center rounded-sm bg-primary text-white'>
          <Plus
            size={20}
            strokeWidth={2.5}
            aria-hidden='true'
          />
        </span>
        <span>Life Hospital</span>
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
      <div className='flex gap-6 justify-center items-center'>
        <Link
          href='/login'
          className='text-sm font-semibold text-primary'>
          Login
        </Link>
        <Link href='#contact'>
          <CustomButton
            className='bg-transparent shadow-none border-2 border-primary text-primary rounded-sm'
            text='Make appointment'
            icon={<ArrowUpRight />}
          />
        </Link>
      </div>
    </header>
  )
}
