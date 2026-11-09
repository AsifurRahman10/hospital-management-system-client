import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Navbar } from '@/components/shared/Navbar'
import HeroSection from '@/components/modules/storeFront/HeroSection'
import { AboutUs } from '@/components/modules/storeFront/AboutUs'
import SpecialtySlider from '@/components/modules/storeFront/SpecialitySlider'
import ContactUs from '@/components/modules/storeFront/ContactUs'

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

      <ContactUs />

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
