import type { ReactNode } from 'react'
import {
  Stethoscope,
  Droplets,
  HeartPulse,
  Syringe,
  BriefcaseMedical,
  FlaskConical,
  Accessibility,
  ClipboardList,
  Pill,
  Microscope,
  Ambulance,
  BedDouble
} from 'lucide-react'
import { Skyline } from '@/components/icon/Skyline'

const icons = [
  Stethoscope,
  Droplets,
  HeartPulse,
  Syringe,
  BriefcaseMedical,
  FlaskConical,
  Accessibility,
  ClipboardList,
  Pill,
  Microscope,
  Ambulance,
  BedDouble
]
const tones = ['text-primary', 'text-accent', 'text-secondary-foreground']

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className='grid min-h-screen bg-background lg:grid-cols-2'>
      {/* Left: form */}
      <section className='relative flex min-h-screen items-center justify-center overflow-hidden bg-card px-6 pb-44 pt-12'>
        <div className='relative z-10 w-full max-w-[340px]'>
          <div className='mb-9 text-center'>
            <h1 className='text-[34px] font-extrabold leading-none tracking-tight text-secondary-foreground'>
              Life Hospital
            </h1>
            <p className='mt-1 text-[17px] font-light'>Management Service</p>
          </div>
          {children}
        </div>
        <p className='absolute inset-x-0 bottom-20 z-10 text-center text-xs text-muted-foreground'>
          Developed by:{' '}
          <b className='font-bold text-foreground'>Asifur Rahman</b>
        </p>
        <Skyline />
      </section>

      {/* Right: icon ring */}
      <section
        aria-hidden
        className='relative hidden items-center justify-center overflow-hidden bg-secondary lg:flex'>
        <div className='relative -mt-14 size-90 rounded-full border border-dashed border-border'>
          <div className='absolute inset-8.5 rounded-full border border-dotted border-border/70' />
          <div className='absolute inset-0 grid place-content-center text-center'>
            <b className='text-[26px] font-extrabold leading-none text-secondary-foreground'>
              Life
            </b>
            <span className='text-xs font-light text-muted-foreground'>
              Hospital
            </span>
          </div>
          {icons.map((Icon, i) => {
            const a = i * 30
            return (
              <div
                key={i}
                className='absolute left-1/2 top-1/2 -m-5 size-10'
                style={{
                  transform: `rotate(${a}deg) translateY(-180px) rotate(${-a}deg)`
                }}>
                <Icon
                  className={`size-full ${tones[i % 3]}`}
                  strokeWidth={1.6}
                />
              </div>
            )
          })}
        </div>
        <Skyline />
      </section>
    </main>
  )
}
