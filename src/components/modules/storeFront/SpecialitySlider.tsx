import { getIconComponent } from '@/app/lib/iconMapper'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import { Skeleton } from '@/components/ui/skeleton'
import { getSpecialties } from '@/service/specialty.service'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'

// Map specialty keywords to icons
const ICON_MAP: Record<string, string> = {
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

type Specialty = {
  id: string
  title: string
  icon?: string
}

// Resolve specialty icon
function getSpecialtyIcon(specialty: Specialty) {
  const { icon, title } = specialty

  if (icon && !icon.startsWith('http') && !icon.startsWith('/')) {
    return getIconComponent(icon)
  }

  const keyword = Object.keys(ICON_MAP).find((key) =>
    title.toLowerCase().includes(key)
  )

  return getIconComponent(keyword ? ICON_MAP[keyword] : 'Stethoscope')
}

// Loading skeleton
function SpecialtySliderSkeleton() {
  return (
    <section className='w-full px-6 py-16 md:py-20'>
      <div className='mx-auto max-w-6xl'>
        <div className='mb-10 flex flex-col items-center'>
          <Skeleton className='h-6 w-36 rounded-full' />
          <Skeleton className='mt-4 h-9 w-64 rounded-md' />
          <Skeleton className='mt-3 h-4 w-80 max-w-full rounded-md' />
        </div>

        <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'>
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className='flex flex-col items-center p-2'>
              <Skeleton className='size-28 rounded-full sm:size-32' />
              <Skeleton className='mt-3.5 h-4 w-20 rounded-md' />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Main content
async function SpecialtySliderContent() {
  const res = await getSpecialties().catch((error) => {
    console.error('Failed to fetch specialties:', error)
    return null
  })

  const specialties: Specialty[] = res?.data ?? []

  if (!specialties.length) return null

  return (
    <section
      id='services'
      aria-labelledby='specialties-title'
      className='w-full px-6 py-16 md:py-20'>
      <div className='mx-auto max-w-6xl'>
        {/* Section Header */}
        <div className='mb-10 text-center'>
          <div className='inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary'>
            <span className='size-2 rounded-full bg-accent' />
            Clinical Departments
          </div>

          <h2
            id='specialties-title'
            className='mt-3 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl md:text-4xl'>
            Top Searched Specialities
          </h2>

          <p className='mt-2 text-sm leading-relaxed text-muted-foreground'>
            Explore our specialized hospital departments, diagnostic services,
            and multidisciplinary medical teams.
          </p>
        </div>

        {/* Specialty Carousel */}
        <div className='relative px-4 sm:px-8'>
          <Carousel
            opts={{
              align: 'start',
              loop: specialties.length > 6
            }}
            className='w-full'>
            <CarouselContent className='-ml-4 py-2'>
              {specialties.map((specialty) => {
                const isImage = Boolean(
                  specialty.icon &&
                    !specialty.icon.includes('example.com') &&
                    (specialty.icon.startsWith('/') ||
                      specialty.icon.startsWith('https://res.cloudinary.com'))
                )

                const Icon = !isImage ? getSpecialtyIcon(specialty) : null

                return (
                  <CarouselItem
                    key={specialty.id}
                    className='basis-1/2 pl-4 sm:basis-1/3 md:basis-1/4 lg:basis-1/6'>
                    <Link
                      href='#contact'
                      className='group flex flex-col items-center justify-center p-2 text-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary'>
                      <div className='flex size-28 items-center justify-center rounded-full border border-border/70 bg-card shadow-xs transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/40 group-hover:bg-primary/5 group-hover:shadow-md sm:size-32'>
                        {isImage ? (
                          <Image
                            src={specialty.icon!}
                            alt={specialty.title}
                            width={44}
                            height={44}
                            className='size-11 object-contain transition-transform duration-300 group-hover:scale-110'
                            unoptimized
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

            {specialties.length > 6 && (
              <>
                <CarouselPrevious className='-left-3 top-[38%] size-9 -translate-y-1/2 rounded-full border border-border/80 bg-background shadow-md sm:-left-6 sm:size-10' />
                <CarouselNext className='-right-3 top-[38%] size-9 -translate-y-1/2 rounded-full border border-border/80 bg-background shadow-md sm:-right-6 sm:size-10' />
              </>
            )}
          </Carousel>
        </div>
      </div>
    </section>
  )
}

// Main component
export default function SpecialtySlider() {
  return (
    <Suspense fallback={<SpecialtySliderSkeleton />}>
      <SpecialtySliderContent />
    </Suspense>
  )
}
