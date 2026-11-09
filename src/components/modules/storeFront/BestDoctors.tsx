import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import { Skeleton } from '@/components/ui/skeleton'
import { getBestDoctors } from '@/service/doctor.service'
import { IDoctor } from '@/types/doctor.types'
import { User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { Suspense } from 'react'

function isValidDoctorImage(url?: string): boolean {
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

const fallbackDoctors: Partial<IDoctor>[] = [
  {
    id: 1,
    name: 'Dr. Darrell Steward',
    designation: 'Senior Cardiologist',
    profilePhoto: '/images/hero-dentist.jpg'
  },
  {
    id: 2,
    name: 'Dr. Jacob Jones',
    designation: 'Neurology Specialist',
    profilePhoto: '/images/hero-detail.jpg'
  },
  {
    id: 3,
    name: 'Dr. Jane Cooper',
    designation: 'Pediatric Specialist',
    profilePhoto: '/images/hero-dentist.jpg'
  },
  {
    id: 4,
    name: 'Dr. Kristin Watson',
    designation: 'Orthopedic Surgeon',
    profilePhoto: '/images/hero-clinic.jpg'
  },
  {
    id: 5,
    name: 'Dr. Ronald Richards',
    designation: 'General Physician',
    profilePhoto: '/images/hero-dentist.jpg'
  }
]

const BestDoctorsSkeleton = () => {
  return (
    <section
      aria-labelledby='best-doctors-title'
      className='w-full px-6 py-12 md:py-16'>
      <div className='mx-auto max-w-3/4'>
        <div className='mb-8 flex items-end justify-between'>
          <div>
            <span className='text-xs font-bold uppercase tracking-wider text-accent'>
              Doctors
            </span>
            <h2
              id='best-doctors-title'
              className='mt-1 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl md:text-4xl'>
              Meet our qualified doctors
            </h2>
          </div>
          <div className='flex items-center gap-2'>
            <Skeleton className='size-9 rounded-md' />
            <Skeleton className='size-9 rounded-md' />
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4'>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className='rounded-[24px] border border-border/50 bg-[#f8fafc] p-3'>
              <Skeleton className='aspect-square w-full rounded-[18px]' />
              <div className='p-2'>
                <Skeleton className='mt-2 h-4 w-28 rounded' />
                <Skeleton className='mt-1 h-3 w-20 rounded' />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const BestDoctorsContent = async () => {
  let doctors: (IDoctor | Partial<IDoctor>)[] = []

  try {
    const res = await getBestDoctors()
    if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
      doctors = res.data
    }
  } catch (error) {
    console.warn('Unable to load best doctors from API, using fallback:', error)
  }

  if (doctors.length === 0) {
    doctors = fallbackDoctors
  }

  return (
    <section
      aria-labelledby='best-doctors-title'
      className='w-full px-6 py-12 md:py-16 bg-white'>
      <div className='mx-auto max-w-3/4'>
        <Carousel
          opts={{
            align: 'start',
            loop: true
          }}
          className='w-full'>
          {/* Header with Title on Left and Navigation Controls on Right */}
          <div className='mb-8 flex items-end justify-between gap-4'>
            <div>
              <span className='text-xs font-bold uppercase tracking-wider text-accent'>
                Doctors
              </span>
              <h2
                id='best-doctors-title'
                className='mt-1 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl md:text-4xl'>
                Meet our qualified doctors
              </h2>
            </div>
            <div className='flex items-center gap-2'>
              <CarouselPrevious className='static translate-x-0 translate-y-0 size-9 rounded-md border border-border bg-white text-foreground shadow-xs transition-colors hover:bg-slate-100 hover:text-foreground' />
              <CarouselNext className='static translate-x-0 translate-y-0 size-9 rounded-md border border-primary bg-primary text-white shadow-xs transition-colors hover:bg-primary/90' />
            </div>
          </div>

          {/* Doctors Carousel Row */}
          <CarouselContent className='-ml-4 py-2'>
            {doctors.map((doctor) => {
              const specialty =
                doctor.doctorSpecialties?.[0]?.specialty?.title ||
                doctor.designation ||
                'Specialist Physician'
              const hasValidImage = isValidDoctorImage(doctor.profilePhoto)

              return (
                <CarouselItem
                  key={doctor.id}
                  className='basis-1/2 pl-4 sm:basis-1/3 lg:basis-1/4'>
                  <Link
                    href='#contact'
                    className='group block rounded-[24px] border border-border/50 bg-[#f8fafc] p-3 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary'>
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
                    <div className='px-1 pt-3 pb-1'>
                      <h3 className='line-clamp-1 text-sm font-bold text-foreground transition-colors group-hover:text-primary sm:text-base'>
                        {doctor.name}
                      </h3>
                      <p className='mt-0.5 line-clamp-1 text-xs text-muted-foreground'>
                        {specialty}
                      </p>
                    </div>
                  </Link>
                </CarouselItem>
              )
            })}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  )
}

export const BestDoctors = () => {
  return (
    <Suspense fallback={<BestDoctorsSkeleton />}>
      <BestDoctorsContent />
    </Suspense>
  )
}

export default BestDoctors
