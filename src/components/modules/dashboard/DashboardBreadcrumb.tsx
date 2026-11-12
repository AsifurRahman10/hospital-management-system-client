'use client'

import { Fragment } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { usePathname } from 'next/navigation'

const segmentLabels: Record<string, string> = {
  appointments: 'Appointments'
}

const formatSegment = (segment: string) =>
  segmentLabels[segment] ??
  segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

const DashboardBreadcrumb = () => {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  return (
    <Breadcrumb className='hidden sm:block'>
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join('/')}`
          const isCurrent = index === segments.length - 1
          const isRolePrefix =
            index === 0 && (segment === 'admin' || segment === 'doctor')

          return (
            <Fragment key={`${segment}-${index}`}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {isCurrent ? (
                  <BreadcrumbPage>{formatSegment(segment)}</BreadcrumbPage>
                ) : isRolePrefix ? (
                  <span className='font-normal text-muted-foreground'>
                    {formatSegment(segment)}
                  </span>
                ) : (
                  <BreadcrumbLink href={href}>
                    {formatSegment(segment)}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default DashboardBreadcrumb
