import Link from 'next/link'
import { Navbar } from '@/components/shared/Navbar'
import HeroSection from '@/components/modules/storeFront/HeroSection'
import { AboutUs } from '@/components/modules/storeFront/AboutUs'
import SpecialtySlider from '@/components/modules/storeFront/SpecialitySlider'
import BestDoctors from '@/components/modules/storeFront/BestDoctors'
import ContactUs from '@/components/modules/storeFront/ContactUs'
import Footer from '@/components/shared/Footer'

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

      <BestDoctors />

      <ContactUs />
      <Footer />
    </>
  )
}
