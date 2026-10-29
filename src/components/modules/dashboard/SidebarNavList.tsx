'use client'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { getIconComponent } from '@/app/lib/iconMapper'
import { NavSection } from '@/types/dashboard.type'

export function SidebarNavList({ items }: { items: NavSection[] }) {
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

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
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
