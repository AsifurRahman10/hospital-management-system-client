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
import { DoctorCard } from '@/components/modules/storeFront/DoctorCard'
import React, { Suspense } from 'react'

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
      className='w-full py-12 md:py-16'>
      <div className='container-custom'>
        <div className='mb-8 flex items-end justify-between'>
          <div>
            <span className='text-xs font-bold uppercase tracking-wider text-accent'>
              Doctors
            </span>
            <h2
              id='best-doctors-title'
              className='mt-1 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl md:text-4xl'>
              Meet some of our qualified doctors
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
      className='w-full py-12 md:py-16 bg-white'>
      <div className='container-custom'>
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
                Meet some of our qualified doctors
              </h2>
            </div>
            <div className='flex items-center gap-2'>
              <CarouselPrevious className='static translate-x-0 translate-y-0 size-9 rounded-md border border-border bg-white text-foreground shadow-xs transition-colors hover:bg-slate-100 hover:text-foreground' />
              <CarouselNext className='static translate-x-0 translate-y-0 size-9 rounded-md border border-primary bg-primary text-white shadow-xs transition-colors hover:bg-primary/90' />
            </div>
          </div>

          {/* Doctors Carousel Row */}
          <CarouselContent className='-ml-4 py-2'>
            {doctors.map((doctor) => (
              <CarouselItem
                key={doctor.id}
                className='basis-1/2 pl-4 sm:basis-1/3 lg:basis-1/4'>
                <DoctorCard
                  doctor={doctor}
                  variant='compact'
                />
              </CarouselItem>
            ))}
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
