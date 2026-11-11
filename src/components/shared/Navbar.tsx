import Link from 'next/link'
import { ArrowUpRight, Plus } from 'lucide-react'
import CustomButton from '@/components/shared/CustomButton'
import { getMe } from '@/service/profile.service'
import { NavbarAuth } from '@/components/shared/NavbarAuth'
import { NavbarLinks } from '@/components/shared/NavbarLinks'

export async function Navbar() {
  let userData = null
  try {
    const isUserLoggedIn = await getMe()
    userData = isUserLoggedIn?.data ?? null
  } catch {
    userData = null
  }

  return (
    <header className='container-custom flex min-h-20.5 items-center justify-between gap-2 md:gap-4'>
      <Link
        href='/'
        aria-label='Life Hospital home'
        className='inline-flex shrink-0 items-center gap-2 text-[15px] font-extrabold text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary'>
        <span className='grid size-8 place-items-center rounded-sm bg-primary text-white'>
          <Plus
            size={20}
            strokeWidth={2.5}
            aria-hidden='true'
          />
        </span>
        <span>Life Hospital</span>
      </Link>
      <NavbarLinks />
      <div className='flex gap-6 justify-center items-center'>
        <NavbarAuth user={userData} />
        <CustomButton
          href='/doctors'
          className='bg-transparent shadow-none border-2 border-primary text-primary rounded-sm hover:bg-transparent'
          text='Make appointment'
          icon={<ArrowUpRight />}
        />
      </div>
    </header>
  )
}
