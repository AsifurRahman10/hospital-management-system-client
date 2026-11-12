import Image from 'next/image'
import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'

export const AboutUs = () => {
  return (
    <section
      id='about'
      aria-labelledby='about-title'
      className='w-full py-12 md:py-20 bg-white'>
      <div className='container-custom'>
        <div className='relative overflow-hidden rounded-[28px] border border-border/70 bg-background p-6 shadow-[0_4px_30px_rgba(0,0,0,0.03)] sm:p-10 md:rounded-[36px] md:p-12 lg:p-16'>
        {/* Faded background watermark */}
        <div
          className='pointer-events-none absolute right-4 top-2 select-none text-6xl font-black uppercase tracking-tight text-slate-200/60 sm:text-7xl md:right-10 md:top-4 md:text-8xl lg:text-9xl'
          aria-hidden='true'>
          About US
        </div>

        <div className='relative z-10 grid items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-20'>
          {/* Left Column: Overlapping framed photos with circular stamp badge */}
          <div className='relative mx-auto w-full max-w-[460px] pb-10 pr-6 sm:pb-12 sm:pr-8'>
            {/* Circular seal stamp badge */}
            <div
              className='absolute -top-3 right-[12%] z-20 flex size-20 items-center justify-center rounded-full bg-white shadow-[0_8px_25px_rgba(15,23,42,0.12)] ring-1 ring-slate-200 sm:size-24'
              aria-label='High Quality Professionals'>
              <svg
                viewBox='0 0 100 100'
                className='absolute inset-0 size-full animate-[spin_24s_linear_infinite]'>
                <path
                  id='aboutCirclePath'
                  d='M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0'
                  fill='none'
                />
                <text className='fill-slate-500 text-[8.5px] font-bold uppercase tracking-[2.2px]'>
                  <textPath
                    href='#aboutCirclePath'
                    startOffset='50%'
                    textAnchor='middle'>
                    High Quality • Professionals •
                  </textPath>
                </text>
              </svg>
              <div className='flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary sm:size-10'>
                <ShieldCheck className='size-5' />
              </div>
            </div>

            {/* Back photo: Inpatient care */}
            <div className='relative aspect-[4/3] w-[82%] overflow-hidden rounded-2xl bg-white p-2.5 shadow-[0_12px_32px_rgba(15,23,42,0.08)] ring-1 ring-slate-100'>
              <div className='relative h-full w-full overflow-hidden rounded-xl'>
                <Image
                  src='/images/hero-detail.jpg'
                  alt='Patient receiving attentive care in modern hospital room'
                  fill
                  sizes='(max-width: 768px) 80vw, 380px'
                  className='object-cover'
                />
              </div>
            </div>

            {/* Front overlapping photo: Lead doctor */}
            <div className='absolute -bottom-2 right-0 aspect-[3.2/3.8] w-[54%] overflow-hidden rounded-2xl bg-white p-2.5 shadow-[0_16px_36px_rgba(15,23,42,0.12)] ring-1 ring-slate-100'>
              <div className='relative h-full w-full overflow-hidden rounded-xl'>
                <Image
                  src='/images/hero-dentist.jpg'
                  alt='Specialist doctor smiling at hospital ward'
                  fill
                  sizes='(max-width: 768px) 50vw, 240px'
                  className='object-cover object-top'
                />
              </div>
            </div>
          </div>

          {/* Right Column: Clean typography, lead, double chevron bullets, button */}
          <div>
            {/* Title with line and dot accent */}
            <div className='flex items-center gap-3'>
              <h2
                id='about-title'
                className='text-2xl font-bold tracking-tight text-primary sm:text-3xl'>
                About US
              </h2>
              <div
                className='flex items-center gap-1.5'
                aria-hidden='true'>
                <span className='h-[2px] w-12 rounded-full bg-primary' />
                <span className='size-2 rounded-full bg-primary' />
              </div>
            </div>

            {/* Bold lead paragraph */}
            <h3 className='mt-5 text-base font-bold leading-relaxed text-foreground sm:text-lg'>
              Life Hospital is dedicated to delivering total medical excellence,
              comprehensive clinical specialties, and patient-first care.
            </h3>

            {/* Bullet points with » prefix as shown in reference */}
            <ul className='mt-5 space-y-3.5 text-sm leading-relaxed text-muted-foreground'>
              <li className='flex items-start gap-2.5'>
                <span
                  className='mt-0.5 select-none font-bold text-primary'
                  aria-hidden='true'>
                  »
                </span>
                <span>
                  Full-spectrum medical care with 24/7 emergency response,
                  modern intensive care units (ICU), and rapid diagnostic triage
                  for critical conditions.
                </span>
              </li>
              <li className='flex items-start gap-2.5'>
                <span
                  className='mt-0.5 select-none font-bold text-primary'
                  aria-hidden='true'>
                  »
                </span>
                <span>
                  Equipped with advanced diagnostic imaging, pathology
                  laboratories, modular surgical theaters, and dedicated
                  post-operative inpatient wards.
                </span>
              </li>
              <li className='flex items-start gap-2.5'>
                <span
                  className='mt-0.5 select-none font-bold text-primary'
                  aria-hidden='true'>
                  »
                </span>
                <span>
                  A multidisciplinary board of experienced specialist
                  physicians, surgeons, and nurses focused on personalized
                  recovery plans and transparent communication.
                </span>
              </li>
            </ul>

            {/* Read More button */}
            <div className='mt-8'>
              <Link
                href='#services'
                className='inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'>
                Read More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  )
}
