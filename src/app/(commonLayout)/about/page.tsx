import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import {
  Activity,
  Award,
  CalendarCheck,
  CheckCircle2,
  Clock,
  HeartPulse,
  Microscope,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users
} from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Us | Life Hospital - Clinical Excellence & Compassionate Care',
  description:
    'Discover Life Hospital: our mission, board-certified medical faculty, world-class surgical facilities, 24/7 trauma care, and patient-first healthcare values.',
  keywords: [
    'Life Hospital',
    'About Hospital',
    'Healthcare Team',
    'Medical Specialists',
    'Clinical Excellence',
    'Patient First Healthcare'
  ],
  openGraph: {
    title: 'About Life Hospital - Modern Healthcare & Medical Faculty',
    description:
      'Providing comprehensive medical care, specialized surgical units, and compassionate patient consultation.'
  }
}

const STATS = [
  { value: '50,000+', label: 'Patients Treated Annually', icon: Users },
  { value: '120+', label: 'Board-Certified Specialists', icon: Stethoscope },
  { value: '99.4%', label: 'Positive Patient Feedback', icon: HeartPulse },
  { value: '24/7', label: 'Emergency Trauma Response', icon: Clock }
]

const PILLARS = [
  {
    icon: ShieldCheck,
    title: 'Patient-First Compassion',
    description:
      'We treat every individual with personalized dignity, complete transparency in treatment planning, and continuous emotional support.'
  },
  {
    icon: Microscope,
    title: 'Precision Diagnostics',
    description:
      'Equipped with state-of-the-art 3T MRI, high-resolution CT imaging, and rapid on-site pathology laboratories for accurate medical decisions.'
  },
  {
    icon: Award,
    title: 'Accredited Excellence',
    description:
      'Compliant with international JCI clinical protocols, stringent hygiene sterilization standards, and verified medical ethics.'
  },
  {
    icon: Activity,
    title: 'Multidisciplinary Teams',
    description:
      'Our physicians, surgeons, nurses, and dietitians collaborate across specialties to design integrated health recovery programs.'
  }
]

const LEADERSHIP = [
  {
    name: 'Dr. Sarah Mitchell, MD',
    role: 'Chief Medical Officer',
    specialty: 'Cardiovascular Surgery',
    experience: '22+ Years Clinical Experience'
  },
  {
    name: 'Dr. Richard James, MBBS, MS',
    role: 'Head of Clinical Medicine',
    specialty: 'Internal Medicine & Critical Care',
    experience: '18+ Years Clinical Experience'
  },
  {
    name: 'Dr. Elena Rostova, PhD',
    role: 'Director of Diagnostic Imaging',
    specialty: 'Radiology & Molecular Medicine',
    experience: '15+ Years Clinical Experience'
  },
  {
    name: 'Dr. Marcus Vance, MD',
    role: 'Head of Pediatrics & Neonatal ICU',
    specialty: 'Pediatric Care & Adolescent Health',
    experience: '16+ Years Clinical Experience'
  }
]

const ACCREDITATIONS = [
  'Joint Commission International (JCI) Accredited',
  'ISO 9001:2015 Healthcare Quality Standard',
  'World Health Organization (WHO) Hospital Partner',
  'National Board of Healthcare Accreditation',
  'Zero-Infection Safety Compliant Intensive Care Units'
]

export default function AboutPage() {
  return (
    <main className='w-full py-10 md:py-16'>
      <div className='container-custom space-y-16 md:space-y-24'>
        {/* 1. Hero Showcase Section */}
        <section
          aria-labelledby='about-hero-title'
          className='relative overflow-hidden rounded-3xl border border-border/80 bg-card p-8 shadow-xs sm:p-12 md:p-16'>
          <div className='pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-primary/10 blur-3xl' />
          <div className='pointer-events-none absolute -bottom-20 -left-20 size-80 rounded-full bg-accent/15 blur-3xl' />

          <div className='relative z-10 max-w-3xl space-y-6'>
            <div className='inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary'>
              <Sparkles className='size-3.5 text-primary' />
              <span>About Life Hospital</span>
            </div>

            <h1
              id='about-hero-title'
              className='text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:leading-[1.15]'>
              Advancing Healthcare with Clinical Precision and Deep Compassion
            </h1>

            <p className='text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg'>
              Founded with the vision to redefine patient-centered healthcare,
              Life Hospital combines world-class medical specialists,
              cutting-edge robotic surgery, and a welcoming care ecosystem
              dedicated to total healing.
            </p>

            <div className='flex flex-wrap items-center gap-3 pt-2'>
              <Link
                href='/doctors'
                className={buttonVariants({
                  className:
                    'h-11 rounded-xl bg-primary px-6 text-xs font-bold text-white shadow-md shadow-primary/20 hover:bg-primary/90'
                })}>
                <CalendarCheck className='mr-2 size-4' />
                Find a Specialist
              </Link>
              <Link
                href='/contact'
                className={buttonVariants({
                  variant: 'outline',
                  className:
                    'h-11 rounded-xl border-border px-6 text-xs font-bold text-foreground hover:bg-muted'
                })}>
                <PhoneCall className='mr-2 size-4 text-primary' />
                Contact Reception
              </Link>
            </div>
          </div>
        </section>

        {/* 2. Key Impact Stats Grid */}
        <section
          aria-labelledby='stats-title'
          className='space-y-4'>
          <h2
            id='stats-title'
            className='sr-only'>
            Our Clinical Milestones and Impact
          </h2>
          <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
            {STATS.map((stat) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.label}
                  className='flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 shadow-2xs transition-all hover:border-primary/40 sm:p-7'>
                  <div className='flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary'>
                    <Icon className='size-5' />
                  </div>
                  <div className='mt-4'>
                    <p className='text-2xl font-black tracking-tight text-foreground sm:text-3xl'>
                      {stat.value}
                    </p>
                    <p className='mt-1 text-xs font-medium text-muted-foreground'>
                      {stat.label}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* 3. Mission & Vision Dual Cards */}
        <section
          aria-labelledby='mission-vision-title'
          className='grid gap-6 md:grid-cols-2'>
          <div className='rounded-2xl border border-border/80 bg-card p-7 shadow-xs sm:p-9'>
            <Badge
              variant='outline'
              className='border-primary/30 bg-primary/5 text-xs font-bold text-primary'>
              Our Mission
            </Badge>
            <h3 className='mt-4 text-xl font-bold tracking-tight text-foreground sm:text-2xl'>
              Accessible, Evidence-Based Medicine for Every Patient
            </h3>
            <p className='mt-3 text-xs leading-relaxed text-muted-foreground sm:text-sm'>
              Our mission is to safeguard and restore health by combining
              rigorous scientific diagnostics, transparent care pricing, and
              unconditional empathy. We eliminate barriers so every family
              receives prompt, trustworthy clinical attention.
            </p>
          </div>

          <div className='rounded-2xl border border-border/80 bg-card p-7 shadow-xs sm:p-9'>
            <Badge
              variant='outline'
              className='border-accent/40 bg-accent/10 text-xs font-bold text-foreground'>
              Our Vision
            </Badge>
            <h3 className='mt-4 text-xl font-bold tracking-tight text-foreground sm:text-2xl'>
              A Smarter, Connected Health Sanctuary
            </h3>
            <p className='mt-3 text-xs leading-relaxed text-muted-foreground sm:text-sm'>
              We aspire to lead regional healthcare through digital health
              records, AI-assisted radiology, minimally invasive operations, and
              preventive community wellness that stops diseases before they
              progress.
            </p>
          </div>
        </section>

        {/* 4. Core Pillars of Clinical Excellence */}
        <section
          aria-labelledby='pillars-title'
          className='space-y-8'>
          <div className='text-center sm:mx-auto sm:max-w-2xl'>
            <div className='inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary'>
              Core Principles
            </div>
            <h2
              id='pillars-title'
              className='mt-3 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl'>
              Why Patients Place Their Trust in Life Hospital
            </h2>
            <p className='mt-2 text-xs text-muted-foreground sm:text-sm'>
              High medical standards combined with attentive personal care from
              admission to full recovery.
            </p>
          </div>

          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon
              return (
                <div
                  key={pillar.title}
                  className='rounded-2xl border border-border/80 bg-card p-6 shadow-2xs transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-xs'>
                  <div className='flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary'>
                    <Icon className='size-5' />
                  </div>
                  <h3 className='mt-4 text-base font-bold text-foreground'>
                    {pillar.title}
                  </h3>
                  <p className='mt-2 text-xs leading-relaxed text-muted-foreground'>
                    {pillar.description}
                  </p>
                </div>
              )
            })}
          </div>
        </section>

        {/* 5. Medical Faculty Leadership */}
        <section
          aria-labelledby='leadership-title'
          className='space-y-8'>
          <div className='flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
            <div>
              <p className='text-xs font-bold uppercase tracking-wider text-primary'>
                Clinical Leadership
              </p>
              <h2
                id='leadership-title'
                className='text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl'>
                Headed by Dedicated Medical Pioneers
              </h2>
            </div>
            <Link
              href='/doctors'
              className='inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline'>
              <span>View all doctors</span>
              <span>&rarr;</span>
            </Link>
          </div>

          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
            {LEADERSHIP.map((leader) => (
              <div
                key={leader.name}
                className='rounded-2xl border border-border/80 bg-card p-6 shadow-2xs'>
                <div className='flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary'>
                  <Stethoscope className='size-7' />
                </div>
                <h3 className='mt-4 text-base font-bold text-foreground'>
                  {leader.name}
                </h3>
                <p className='mt-0.5 text-xs font-semibold text-primary'>
                  {leader.role}
                </p>
                <p className='mt-2 text-xs text-muted-foreground'>
                  {leader.specialty}
                </p>
                <div className='mt-4 border-t border-border/60 pt-3 text-[11px] font-medium text-muted-foreground'>
                  {leader.experience}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Accreditations & Safety Badges */}
        <section
          aria-labelledby='accreditations-title'
          className='rounded-3xl border border-border/80 bg-[#f8fafc] p-8 shadow-xs sm:p-10 md:p-12'>
          <div className='flex flex-col gap-8 md:flex-row md:items-center md:justify-between'>
            <div className='max-w-md space-y-2'>
              <div className='inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary'>
                <ShieldCheck className='size-4' />
                <span>Quality & Compliance</span>
              </div>
              <h2
                id='accreditations-title'
                className='text-2xl font-extrabold tracking-tight text-foreground'>
                Rigorous International Medical Standards
              </h2>
              <p className='text-xs text-muted-foreground leading-relaxed'>
                Life Hospital operates under globally audited hospital hygiene,
                surgical sterility, and bio-medical patient safety guidelines.
              </p>
            </div>

            <div className='grid gap-3 sm:grid-cols-2'>
              {ACCREDITATIONS.map((badge) => (
                <div
                  key={badge}
                  className='flex items-center gap-2.5 rounded-xl border border-border/70 bg-card p-3 text-xs font-semibold text-foreground shadow-2xs'>
                  <CheckCircle2 className='size-4 shrink-0 text-primary' />
                  <span>{badge}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Bottom Call To Action */}
        <section
          aria-labelledby='cta-title'
          className='rounded-3xl bg-primary p-8 text-white shadow-xl sm:p-12 md:p-16'>
          <div className='flex flex-col items-start justify-between gap-8 md:flex-row md:items-center'>
            <div className='max-w-xl space-y-3'>
              <h2
                id='cta-title'
                className='text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl text-white'>
                Experience Modern Healthcare with Life Hospital
              </h2>
              <p className='text-xs sm:text-sm text-white/80 leading-relaxed'>
                Our outpatient clinics and specialized surgical faculties are
                ready to care for you and your family. Book an instant
                consultation or reach our triage desk.
              </p>
            </div>

            <div className='flex flex-wrap items-center gap-3'>
              <Link
                href='/doctors'
                className={buttonVariants({
                  variant: 'secondary',
                  className:
                    'h-12 rounded-xl bg-white px-6 text-xs font-bold text-primary shadow-md hover:bg-white/95'
                })}>
                Book Doctor Consultation
              </Link>
              <Link
                href='/contact'
                className={buttonVariants({
                  variant: 'outline',
                  className:
                    'h-12 rounded-xl border-white/30 bg-transparent px-6 text-xs font-bold text-white hover:bg-white/10'
                })}>
                Hospital Directions & Contact
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
