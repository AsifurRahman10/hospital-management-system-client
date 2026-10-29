'use client'

import { getIconComponent } from '@/app/lib/iconMapper'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { NavSection } from '@/types/dashboard.type'
import { usePathname } from 'next/navigation'

export function SidebarNavList({ items }: { items: NavSection[] }) {
  const pathname = usePathname()
  const normalizedPathname = pathname.replace(/\/$/, '') || '/'
  const activeHref = items
    .flatMap((section) => section.items)
    .map((item) => (item.href.startsWith('/') ? item.href : `/${item.href}`))
    .filter(
      (href) =>
        normalizedPathname === href ||
        (href !== '/' && normalizedPathname.startsWith(`${href}/`))
    )
    .sort((first, second) => second.length - first.length)[0]

  return (
    <>
      {items.map((section, index) => (
        <SidebarGroup key={section.title ?? `section-${index}`}>
          {section.title && (
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
          )}
          <SidebarMenu>
            {section.items.map((item) => {
              const Icon = getIconComponent(item.icon)
              const href = item.href.startsWith('/')
                ? item.href
                : `/${item.href}`

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={href === activeHref}
                    className='transition-colors hover:bg-primary/5 hover:text-primary data-active:bg-primary/10 data-active:font-semibold data-active:text-primary'
                    render={<a href={item.href} />}>
                    <Icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  )
}
