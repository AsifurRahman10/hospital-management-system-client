import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  Check,
  HeartPulse,
  ShieldCheck,
  Sparkles
} from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { ServiceCard } from '@/components/modules/dashboard/service-card'
import { Navbar } from '@/components/shared/Navbar'
import HeroSection from '@/components/modules/storeFront/HeroSection'

const services = [
  {
    icon: Sparkles,
    title: 'Implant dentistry',
    description:
      'Thoughtful tooth replacement planned around your health and comfort.'
  },
  {
    icon: ShieldCheck,
    title: 'Preventive care',
    description:
      'Regular check-ups and clear guidance to protect your smile at every stage.'
  },
  {
    icon: HeartPulse,
    title: 'Gentle treatment',
    description:
      'Modern techniques and a calm team make every visit feel more manageable.'
  }
]

const carePoints = [
  'A clear plan before treatment begins',
  'Time to ask questions and feel heard',
  'Modern care in a welcoming clinic'
]

export default function Home() {
  return (
    <>
      <div
        id='top'
        className='bg-background'>
        <Navbar />
        <main>
          <HeroSection />
        </main>
      </div>

      <section
        id='about'
        aria-labelledby='about-title'
        className='bg-white px-6 py-16 md:py-[76px]'>
        <div className='mx-auto grid max-w-[1080px] gap-8 md:grid-cols-[0.9fr_1fr] md:items-center md:gap-14 lg:gap-[110px]'>
          <div className='relative min-h-[250px] overflow-hidden rounded-bl-[5px] rounded-br-[80px] rounded-tl-[80px] rounded-tr-[5px] bg-secondary md:min-h-[287px]'>
            <Image
              src='/images/hero-detail.jpg'
              alt='A clinician providing careful, patient-centered treatment'
              fill
              sizes='(max-width: 767px) 100vw, 42vw'
              className='object-cover'
            />
            <div className='absolute bottom-4 left-4 max-w-[210px] rounded-sm bg-white/95 p-4 shadow-sm backdrop-blur-sm'>
              <p className='text-xs font-bold uppercase text-primary'>
                Care that listens
              </p>
              <p className='mt-1 text-sm font-semibold text-foreground'>
                Your comfort comes first.
              </p>
            </div>
          </div>
          <div>
            <p className='text-sm font-extrabold uppercase text-primary'>
              About us
            </p>
            <h2
              id='about-title'
              className='mt-3 text-[32px] font-extrabold leading-tight text-foreground sm:text-[38px]'>
              Patient health is the highest value in our work
            </h2>
            <p className='mt-5 text-sm leading-6 text-muted-foreground'>
              Great dentistry starts with trust. We take time to understand your
              needs, explain your options, and make a care plan that feels right
              for you.
            </p>
            <ul className='mt-6 space-y-3'>
              {carePoints.map((point) => (
                <li
                  key={point}
                  className='flex items-start gap-3 text-sm font-medium'>
                  <Check
                    size={17}
                    className='mt-0.5 shrink-0 text-primary'
                    aria-hidden='true'
                  />
                  {point}
                </li>
              ))}
            </ul>
            <Link
              href='#services'
              className='mt-7 inline-flex min-h-11 items-center gap-2 text-sm font-extrabold text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary'>
              Learn more{' '}
              <ArrowRight
                size={16}
                aria-hidden='true'
              />
            </Link>
          </div>
        </div>
      </section>

      <section
        id='services'
        aria-labelledby='services-title'
        className='px-6 py-16 md:py-[76px]'>
        <div className='mx-auto max-w-[1080px]'>
          <div className='mx-auto max-w-[560px] text-center'>
            <p className='text-sm font-extrabold uppercase text-primary'>
              Services
            </p>
            <h2
              id='services-title'
              className='mt-3 text-[32px] font-extrabold leading-tight text-foreground sm:text-[40px]'>
              High-quality care for every smile
            </h2>
            <p className='mt-4 text-sm leading-6 text-muted-foreground'>
              From preventive visits to restorative treatment, we make your next
              step clear and comfortable.
            </p>
          </div>
          <div className='mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[30px]'>
            {services.map((service) => (
              <ServiceCard
                key={service.title}
                {...service}
              />
            ))}
          </div>
        </div>
      </section>

      <section
        id='contact'
        aria-labelledby='contact-title'
        className='px-6 pb-16 pt-4 md:pb-20'>
        <div className='mx-auto flex max-w-[1080px] flex-col items-start gap-8 rounded-[28px] bg-primary px-7 py-9 text-white md:flex-row md:items-center md:justify-between md:px-12 md:py-10 lg:px-16'>
          <div className='max-w-[540px]'>
            <p className='text-sm font-extrabold uppercase text-accent'>
              We are here for you
            </p>
            <h2
              id='contact-title'
              className='mt-2 text-[30px] font-extrabold leading-tight sm:text-[36px]'>
              A healthier smile starts with a conversation.
            </h2>
            <p className='mt-3 text-sm leading-6 text-white/75'>
              Call our team to talk through your needs and find a time that
              works.
            </p>
          </div>
          <a
            href='tel:01010928888'
            className={buttonVariants({
              className:
                'h-[46px] shrink-0 rounded-sm bg-white px-5 text-sm font-bold text-primary hover:bg-white/90'
            })}>
            Call 010-10928888 <ArrowRight aria-hidden='true' />
          </a>
        </div>
      </section>

      <footer className='border-t border-border bg-white px-6 py-7'>
        <div className='mx-auto flex max-w-[1080px] flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between'>
          <p className='font-extrabold text-foreground'>Life Hospital Dental</p>
          <p>Thoughtful care for healthier smiles.</p>
          <Link
            href='#top'
            className='font-semibold text-primary hover:underline'>
            Back to top
          </Link>
        </div>
      </footer>
    </>
  )
}
