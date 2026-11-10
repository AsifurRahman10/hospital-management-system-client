import { Skeleton } from '@/components/ui/skeleton'
import { IDoctor } from '@/types/doctor.types'
import { Briefcase, Star, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { cn } from 'cn'

export function isValidDoctorImage(url?: string): boolean {
  if (!url) return false
  if (url.includes('example.com')) return false
  if (url.startsWith('/')) return true
  try {
    const parsed = new URL(url)
    return parsed.hostname === 'res.cloudinary.com'
  } catch {
    return false
  }
}

export interface DoctorCardProps {
  doctor: IDoctor | Partial<IDoctor>
  variant?: 'compact' | 'detailed'
  href?: string
  className?: string
}

export const DoctorCardSkeleton = ({
  variant = 'detailed',
  className
}: {
  variant?: 'compact' | 'detailed'
  className?: string
}) => {
  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'block rounded-[24px] border border-border/50 bg-[#f8fafc] p-3 shadow-xs',
          className
        )}>
        <Skeleton className='aspect-square w-full rounded-[18px]' />
        <div className='space-y-1.5 px-1 pb-1 pt-3'>
          <Skeleton className='h-4 w-28 rounded' />
          <Skeleton className='h-3 w-20 rounded' />
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex h-full flex-col justify-between rounded-[22px] border border-border/70 bg-card p-3 shadow-xs',
        className
      )}>
      <div>
        <Skeleton className='aspect-square w-full rounded-[16px]' />
        <div className='space-y-2 px-1 pt-3.5 pb-1'>
          <div className='flex items-center justify-between'>
            <Skeleton className='h-3.5 w-16 rounded' />
            <Skeleton className='h-3.5 w-10 rounded' />
          </div>
          <Skeleton className='mt-2 h-5 w-3/4 rounded-md' />
          <Skeleton className='h-3.5 w-1/2 rounded' />
          <Skeleton className='mt-1.5 h-3 w-2/3 rounded' />
        </div>
      </div>
    </div>
  )
}

export const DoctorCard = ({
  doctor,
  variant = 'detailed',
  href,
  className
}: DoctorCardProps) => {
  const targetHref =
    href && href !== '#contact' && href !== '/#contact'
      ? href
      : doctor.id
        ? `/doctors/${doctor.id}`
        : '/doctors'
  const specialty =
    doctor.doctorSpecialties?.[0]?.specialty?.title ||
    doctor.designation ||
    'Specialist Physician'
  const hasValidImage = isValidDoctorImage(doctor.profilePhoto)
  const isCompact = variant === 'compact'

  if (isCompact) {
    return (
      <Link
        href={targetHref}
        className={cn(
          'group block rounded-[24px] border border-border/50 bg-[#f8fafc] p-3 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary',
          className
        )}>
        <div className='relative aspect-square w-full overflow-hidden rounded-[18px] bg-muted'>
          {hasValidImage ? (
            <Image
              src={doctor.profilePhoto!}
              alt={doctor.name || 'Doctor'}
              fill
              sizes='(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw'
              className='object-cover transition-transform duration-500 group-hover:scale-105'
            />
          ) : (
            <div className='flex size-full items-center justify-center bg-secondary/50 text-primary/60'>
              <User
                className='size-14'
                aria-hidden='true'
              />
            </div>
          )}
        </div>
        <div className='px-1 pb-1 pt-3'>
          <h3 className='line-clamp-1 text-sm font-bold text-foreground transition-colors group-hover:text-primary sm:text-base'>
            {doctor.name}
          </h3>
          <p className='mt-0.5 line-clamp-1 text-xs text-muted-foreground'>
            {specialty}
          </p>
        </div>
      </Link>
    )
  }

  // Detailed Card for /doctors directory matching reference design
  return (
    <Link
      href={targetHref}
      className={cn(
        'group flex h-full flex-col justify-between rounded-[22px] border border-border/70 bg-card p-3 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary',
        className
      )}>
      <div>
        {/* Photo Container with soft tint background */}
        <div className='relative aspect-square w-full overflow-hidden rounded-[16px] bg-[#eaeffa]'>
          {hasValidImage ? (
            <Image
              src={doctor.profilePhoto!}
              alt={doctor.name || 'Doctor'}
              fill
              sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
              className='object-cover transition-transform duration-500 group-hover:scale-105'
            />
          ) : (
            <div className='flex size-full items-center justify-center text-primary/40'>
              <User
                className='size-16'
                aria-hidden='true'
              />
            </div>
          )}

          {/* Rating Pill overlay if available */}
          {typeof doctor.averageRating === 'number' &&
            doctor.averageRating > 0 && (
              <div className='absolute right-2.5 top-2.5 flex items-center gap-1 rounded-full border border-white/60 bg-white/95 px-2 py-0.5 text-[11px] font-bold text-foreground shadow-xs backdrop-blur-md'>
                <Star
                  className='size-3 fill-amber-400 text-amber-400'
                  aria-hidden='true'
                />
                <span>{doctor.averageRating.toFixed(1)}</span>
              </div>
            )}

          {/* Experience tag if available */}
          {typeof doctor.experience === 'number' && doctor.experience > 0 && (
            <div className='absolute bottom-2.5 left-2.5 rounded-md bg-foreground/80 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-xs'>
              {doctor.experience}+ yrs exp
            </div>
          )}
        </div>

        {/* Doctor Details */}
        <div className='px-1 pt-3.5 pb-1'>
          {/* Availability and Fee Header */}
          <div className='flex items-center justify-between gap-1'>
            <div className='flex items-center gap-1.5 text-xs font-semibold text-emerald-600'>
              <span className='size-2 rounded-full bg-emerald-500' />
              Available
            </div>
            {doctor.appointmentFee ? (
              <span className='text-xs font-extrabold text-primary'>
                ${doctor.appointmentFee}
              </span>
            ) : null}
          </div>

          <h3 className='mt-2 line-clamp-1 text-base font-bold text-foreground transition-colors group-hover:text-primary'>
            {doctor.name}
          </h3>

          <p className='mt-0.5 line-clamp-1 text-xs text-muted-foreground'>
            {specialty}
          </p>

          {doctor.currentWorkplace && (
            <p className='mt-1.5 flex items-center gap-1 line-clamp-1 text-[11px] text-muted-foreground'>
              <Briefcase
                className='size-3 shrink-0 text-primary/70'
                aria-hidden='true'
              />
              <span>{doctor.currentWorkplace}</span>
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}

export default DoctorCard
