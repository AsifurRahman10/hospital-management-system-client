'use client'

import { buttonVariants } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { IDoctorDetails } from '@/types/doctor.types'
import { Lock, LogIn, UserCheck } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export const SchedulePickerSkeleton = () => (
  <div className='rounded-2xl border border-border/80 bg-card p-8 shadow-xs space-y-4'>
    <div className='flex items-center gap-3'>
      <Skeleton className='size-10 rounded-xl' />
      <div className='space-y-1.5'>
        <Skeleton className='h-4 w-48' />
        <Skeleton className='h-3 w-64' />
      </div>
    </div>
    <Skeleton className='h-72 w-full rounded-xl' />
  </div>
)

export const ScheduleLoginGate = ({ doctor }: { doctor: IDoctorDetails }) => (
  <div className='rounded-2xl border border-dashed border-border/80 bg-card p-8 text-center shadow-xs sm:p-12'>
    <div className='mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary'>
      <Lock className='size-8' />
    </div>

    <span className='mt-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary'>
      Patient Portal Exclusive
    </span>

    <h3 className='mt-3 text-xl font-extrabold tracking-tight text-foreground sm:text-2xl'>
      Log In to View & Book Schedules
    </h3>

    <p className='mx-auto mt-2 max-w-md text-xs sm:text-sm text-muted-foreground leading-relaxed'>
      Real-time appointment schedules and consultation booking for Dr.{' '}
      {doctor.name} are accessible exclusively to logged-in patients.
    </p>

    <div className='mt-8 flex flex-wrap items-center justify-center gap-3'>
      <Link
        href={`/login?redirect=/doctors/${doctor.id}`}
        className={buttonVariants({
          className:
            'h-11 rounded-xl bg-primary px-6 text-xs font-bold text-white shadow-md shadow-primary/20 hover:bg-primary/90'
        })}>
        <LogIn className='mr-2 size-4' />
        Log In as Patient
      </Link>

      <Link
        href='/register'
        className={buttonVariants({
          variant: 'outline',
          className:
            'h-11 rounded-xl border-border px-6 text-xs font-bold text-foreground hover:bg-muted'
        })}>
        Create an Account
      </Link>
    </div>
  </div>
)

export const ScheduleRoleGate = () => (
  <div className='rounded-2xl border border-amber-200 bg-amber-50/50 p-8 text-center shadow-xs dark:border-amber-900/50 dark:bg-amber-950/20'>
    <div className='mx-auto flex size-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'>
      <UserCheck className='size-7' />
    </div>
    <h3 className='mt-3 text-lg font-bold text-foreground'>
      Patient Account Needed
    </h3>
  </div>
)
