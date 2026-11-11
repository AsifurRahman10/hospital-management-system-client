'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  { href: '/', label: 'Home' },
  { href: '/doctors', label: 'Doctors' },
  { href: '/about', label: 'About us' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contacts' }
]

export function NavbarLinks() {
  const pathname = usePathname()
  const normalizedPathname = pathname.replace(/\/$/, '') || '/'

  return (
    <nav
      aria-label='Main navigation'
      className='hidden items-center gap-7 md:flex'>
      {navigation.map((item) => {
        const isActive =
          normalizedPathname === item.href ||
          (item.href !== '/' && normalizedPathname.startsWith(`${item.href}/`))

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
