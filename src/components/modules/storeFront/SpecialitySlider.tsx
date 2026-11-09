import { getIconComponent } from '@/app/lib/iconMapper'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import { getSpecialties } from '@/service/specialty.service'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const PRELOADED_ICONS: Record<string, string> = {
  cardio: 'HeartPulse',
  heart: 'HeartPulse',
  neuro: 'Brain',
  brain: 'Brain',
  ortho: 'Bone',
  bone: 'Bone',
  pedia: 'Baby',
  child: 'Baby',
  eye: 'Eye',
  ophthal: 'Eye',
  derma: 'Sparkles',
  skin: 'Sparkles',
  emergen: 'ShieldCheck',
  icu: 'ShieldCheck',
  trauma: 'ShieldCheck',
  gynec: 'Activity',
  general: 'Stethoscope',
  primary: 'Stethoscope',
  dental: 'Smile',
  dentist: 'Smile'
}

function resolveSpecialtyIcon(specialty: { icon?: string; title: string }) {
  if (
    specialty.icon &&
    !specialty.icon.startsWith('http') &&
    !specialty.icon.startsWith('/')
  ) {
    return getIconComponent(specialty.icon)
  }

  const titleLower = specialty.title.toLowerCase()
  const matchedKey = Object.keys(PRELOADED_ICONS).find((k) =>
    titleLower.includes(k)
  )

  return getIconComponent(
    matchedKey ? PRELOADED_ICONS[matchedKey] : 'Stethoscope'
  )
}

const SpecialtySlider = async () => {
  const res = await getSpecialties().catch(() => null)
  const specialties = res?.data || []

  if (!specialties.length) {
    return null
  }

  return (
    <section
      id='services'
      aria-labelledby='specialties-title'
      className='w-full px-6 py-16 md:py-20'>
      <div className='mx-auto max-w-3/4'>
        {/* Section Header */}
        <div className='mb-10 text-left'>
          <div className='inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary'>
            <span className='size-2 rounded-full bg-accent' />
            Clinical Departments
          </div>
          <h2
            id='specialties-title'
            className='mt-3 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl md:text-4xl'>
            Top Searched Specialities
          </h2>
          <p className='mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground'>
            Explore our specialized hospital departments, diagnostic services,
            and multidisciplinary medical teams.
          </p>
        </div>

        {/* Carousel Slider */}
        <div className='relative px-4 sm:px-8'>
          <Carousel
            opts={{
              align: 'start',
              loop: true
            }}
            className='w-full'>
            <CarouselContent className='-ml-4 py-2'>
              {specialties.map((specialty) => {
                const isImageUrl =
                  specialty.icon &&
                  (specialty.icon.startsWith('http') ||
                    specialty.icon.startsWith('/'))
                const Icon = !isImageUrl
                  ? resolveSpecialtyIcon(specialty)
                  : null

                return (
                  <CarouselItem
                    key={specialty.id}
                    className='basis-1/2 pl-4 sm:basis-1/3 md:basis-1/4 lg:basis-1/6'>
                    <Link
                      href='#contact'
                      className='group flex flex-col items-center justify-center p-2 text-center transition-transform focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary'>
                      <div className='relative flex size-28 items-center justify-center rounded-full border border-border/70 bg-card shadow-xs transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/40 group-hover:bg-primary/5 group-hover:shadow-md sm:size-32'>
                        {isImageUrl ? (
                          <Image
                            src={specialty.icon!}
                            alt={specialty.title}
                            fill
                            className='object-cover rounded-full transition-transform duration-300 group-hover:scale-110'
                          />
                        ) : Icon ? (
                          <Icon
                            className='size-9 text-amber-500 transition-transform duration-300 group-hover:scale-110 group-hover:text-primary sm:size-10'
                            strokeWidth={1.75}
                            aria-hidden='true'
                          />
                        ) : null}
                      </div>
                      <span className='mt-3.5 line-clamp-1 text-sm font-semibold text-foreground transition-colors group-hover:text-primary'>
                        {specialty.title}
                      </span>
                    </Link>
                  </CarouselItem>
                )
              })}
            </CarouselContent>
            <CarouselPrevious className='-left-3 top-[38%] size-9 -translate-y-1/2 rounded-full border border-border/80 bg-background shadow-md transition-colors hover:bg-primary hover:text-white sm:-left-6 sm:size-10' />
            <CarouselNext className='-right-3 top-[38%] size-9 -translate-y-1/2 rounded-full border border-border/80 bg-background shadow-md transition-colors hover:bg-primary hover:text-white sm:-right-6 sm:size-10' />
          </Carousel>
        </div>
      </div>
    </section>
  )
}

export default SpecialtySlider
