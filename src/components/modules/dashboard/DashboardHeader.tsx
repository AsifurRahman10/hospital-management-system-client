'use client'

import { cn } from '@/app/lib/utils'
import { ReactNode, useMemo } from 'react'

export interface DashboardHeaderUser {
  name?: string
  role?: string
}

export interface DashboardHeaderProps {
  user?: DashboardHeaderUser | null
  title?: string
  subtitle?: string
  action?: ReactNode
  showDate?: boolean
  className?: string
}

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export const DashboardHeader = ({
  user,
  title,
  subtitle = 'Here is what needs your attention today.',
  action,
  showDate = true,
  className
}: DashboardHeaderProps) => {
  const formattedDate = useMemo(() => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date())
  }, [])

  const headerTitle = useMemo(() => {
    if (title) return title

    const greeting = getGreeting()
    const rawName = user?.name?.trim()

    if (!rawName) {
      return `${greeting}!`
    }

    const isDoctor = user?.role?.toUpperCase() === 'DOCTOR'
    const displayName =
      isDoctor && !rawName.startsWith('Dr.') ? `Dr. ${rawName}` : rawName

    return `${greeting}, ${displayName}`
  }, [title, user?.name, user?.role])

  return (
    <section
      className={cn(
        'flex flex-col justify-between gap-4 md:flex-row md:items-end',
        className
      )}>
      <div>
        {showDate && (
          <p className='mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary'>
            {formattedDate}
          </p>
        )}
        <h1 className='text-3xl font-extrabold tracking-tight text-foreground md:text-4xl'>
          {headerTitle}
        </h1>
        <p className='mt-2 text-sm text-muted-foreground'>{subtitle}</p>
      </div>

      {action && <div className='shrink-0'>{action}</div>}
    </section>
  )
}

export default DashboardHeader
