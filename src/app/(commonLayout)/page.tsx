import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Navbar } from '@/components/shared/Navbar'
import HeroSection from '@/components/modules/storeFront/HeroSection'
import { AboutUs } from '@/components/modules/storeFront/AboutUs'
import SpecialtySlider from '@/components/modules/storeFront/SpecialitySlider'

export default function Home() {
  return (
    <>
      <div className='bg-background'>
        <Navbar />
        <main>
          <HeroSection />
        </main>
      </div>

      <AboutUs />

      <SpecialtySlider />

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
