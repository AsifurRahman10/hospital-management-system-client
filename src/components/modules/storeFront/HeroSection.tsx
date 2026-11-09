import { buttonVariants } from '@/components/ui/button'
import {
  Activity,
  ArrowRight,
  Clock,
  HeartPulse,
  ShieldCheck,
  Stethoscope
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const HeroSection = () => {
  return (
    <section
      aria-labelledby='hero-title'
      className='relative mx-auto grid w-full max-w-3/4 items-center gap-12 px-6 pb-20 pt-10 md:min-h-[calc(100vh-81px)] md:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] md:gap-10 md:px-[5%] md:pb-16 md:pt-8 lg:gap-16 lg:px-[60px]'>
      {/* Decorative ambient glow */}
      <div
        className='pointer-events-none absolute -top-12 left-1/4 -z-10 size-96 rounded-full bg-primary/10 blur-3xl'
        aria-hidden='true'
      />

      <div className='md:py-8'>
        <h1
          id='hero-title'
          className='text-[40px] font-extrabold leading-[1.12] text-foreground sm:text-[48px] lg:text-[54px]'>
          Advanced care for life,{' '}
          <span className='text-primary'>complete hospital</span> services.
        </h1>

        <p className='mt-6 max-w-[480px] text-base leading-7 text-muted-foreground sm:text-lg'>
          From 24/7 emergency response and specialized diagnostics to inpatient
          treatment and advanced surgical care, our multidisciplinary medical
          teams are dedicated to your wellbeing at every step.
        </p>

        <div className='mt-8 flex flex-wrap items-center gap-4'>
          <Link
            href='#contact'
            className={buttonVariants({
              className:
                'h-12 rounded-lg bg-primary px-6 text-sm font-bold text-white shadow-[0_4px_16px_rgba(49,103,217,0.3)] transition-all hover:bg-primary/90 hover:shadow-[0_6px_20px_rgba(49,103,217,0.4)]'
            })}>
            Make an appointment{' '}
            <ArrowRight
              className='ml-2 size-4'
              aria-hidden='true'
            />
          </Link>
          <a
            href='#services'
            className='inline-flex h-12 items-center gap-2 rounded-lg border border-border bg-card/60 px-5 text-sm font-bold text-foreground backdrop-blur-xs transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary'>
            Explore hospital care
            <ArrowRight
              size={16}
              aria-hidden='true'
            />
          </a>
        </div>

        <div className='mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-border pt-6 text-xs font-semibold text-muted-foreground'>
          <span className='inline-flex items-center gap-2 text-foreground/80'>
            <span className='flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary'>
              <Clock
                size={13}
                aria-hidden='true'
              />
            </span>
            24/7 Emergency Care
          </span>
          <span className='inline-flex items-center gap-2 text-foreground/80'>
            <span className='flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary'>
              <Stethoscope
                size={13}
                aria-hidden='true'
              />
            </span>
            50+ Specialist Doctors
          </span>
          <span className='inline-flex items-center gap-2 text-foreground/80'>
            <span className='flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary'>
              <ShieldCheck
                size={13}
                aria-hidden='true'
              />
            </span>
            Modern Diagnostics
          </span>
        </div>
      </div>

      <div
        className='relative mx-auto w-full md:ml-auto'
        aria-label='Life Hospital modern facilities and specialist care team'>
        <div className='grid grid-cols-[1.15fr_1fr] gap-3'>
          <div className='grid min-h-[320px] grid-rows-[0.8fr_1fr] gap-3 md:min-h-[360px]'>
            <div className='relative overflow-hidden rounded-2xl border border-border/50 shadow-sm'>
              <Image
                src='/images/hero-clinic.jpg'
                alt='Modern hospital treatment and consultation facility'
                fill
                sizes='(max-width: 767px) 50vw, 260px'
                className='object-cover transition-transform duration-500 hover:scale-105'
                priority
              />
            </div>
            <div className='grid grid-cols-2 gap-3'>
              <div className='relative overflow-hidden rounded-2xl border border-border/50 shadow-sm'>
                <Image
                  src='/images/hero-detail.jpg'
                  alt='Specialized clinical medical procedure and patient attention'
                  fill
                  sizes='(max-width: 767px) 25vw, 130px'
                  className='object-cover transition-transform duration-500 hover:scale-105'
                />
              </div>
              <div className='relative overflow-hidden rounded-2xl border border-border/50 shadow-sm'>
                <Image
                  src='/images/hero-clinic.jpg'
                  alt='Advanced medical care ward and equipment'
                  fill
                  sizes='(max-width: 767px) 25vw, 130px'
                  className='object-cover object-right transition-transform duration-500 hover:scale-105'
                />
              </div>
            </div>
          </div>

          <div className='relative min-h-[320px] overflow-hidden rounded-3xl border border-border/50 shadow-md md:min-h-[360px]'>
            <Image
              src='/images/hero-dentist.jpg'
              alt='Experienced hospital physician welcoming patients'
              fill
              sizes='(max-width: 767px) 45vw, 230px'
              className='object-cover transition-transform duration-500 hover:scale-105'
              priority
            />
            {/* Overlay badge on top right */}
            <div className='absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-white/90 px-3 py-1 text-[11px] font-bold text-foreground shadow-sm backdrop-blur-md'>
              <Activity
                size={13}
                className='text-primary'
                aria-hidden='true'
              />
              Full-Spectrum Care
            </div>
          </div>
        </div>

        {/* Floating modern stat card */}
        <div className='absolute -bottom-4 left-4 z-10 flex items-center gap-3 rounded-2xl border border-border/60 bg-card/95 p-3.5 shadow-xl backdrop-blur-md transition-transform hover:-translate-y-0.5 sm:-bottom-5 sm:left-6'>
          <div className='flex size-10 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/25'>
            <HeartPulse
              size={20}
              aria-hidden='true'
            />
          </div>
          <div>
            <p className='text-xs font-bold text-foreground'>
              24/7 Emergency & ICU
            </p>
            <p className='text-[11px] font-medium text-muted-foreground'>
              Immediate clinical response
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
