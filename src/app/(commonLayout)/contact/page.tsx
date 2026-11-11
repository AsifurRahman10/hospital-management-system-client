import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import ContactInquiryForm from '@/components/modules/storeFront/ContactInquiryForm'
import {
  AlertCircle,
  Ambulance,
  Building2,
  CalendarCheck,
  Clock,
  Mail,
  MapPin,
  ShieldCheck,
  Sparkles
} from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Contact Life Hospital | 24/7 Emergency, Inquiries & Campus Map',
  description:
    'Contact Life Hospital: 24/7 emergency trauma hotline, appointment scheduling desk, visiting hours, central medical campus address, and department extensions.',
  keywords: [
    'Contact Life Hospital',
    'Emergency Hotline',
    'Hospital Address',
    'Doctor Appointment Desk',
    'Visiting Hours',
    'Ambulance Service'
  ],
  openGraph: {
    title: 'Contact Life Hospital - 24/7 Healthcare Helpline & Campus Info',
    description:
      'Connect with our clinical reception, ambulance dispatch, and patient assistance desks.'
  }
}

const CHANNELS = [
  {
    icon: Ambulance,
    title: '24/7 Emergency & Trauma',
    description: 'Immediate ambulance dispatch and trauma triage.',
    contact: '01010928888',
    actionText: 'Call Emergency',
    href: 'tel:01010928888',
    highlight: true
  },
  {
    icon: CalendarCheck,
    title: 'Outpatient Appointments',
    description: 'Schedule doctor visits and diagnostic procedures.',
    contact: '01010928889',
    actionText: 'Book or Call',
    href: '/doctors',
    highlight: false
  },
  {
    icon: Mail,
    title: 'Patient Support Desk',
    description: 'General medical inquiries, bills, and records.',
    contact: 'support@lifehospital.com',
    actionText: 'Send Email',
    href: 'mailto:support@lifehospital.com',
    highlight: false
  }
]

const DEPARTMENTS = [
  { name: 'General Reception & Info', ext: 'Ext. 101' },
  { name: 'Pharmacy (24 Hours)', ext: 'Ext. 204' },
  { name: 'Diagnostic Imaging & MRI', ext: 'Ext. 312' },
  { name: 'Pathology & Blood Bank', ext: 'Ext. 318' },
  { name: 'Patient Billing & Insurance', ext: 'Ext. 405' },
  { name: 'Inpatient Admissions Desk', ext: 'Ext. 410' }
]

export default function ContactPage() {
  return (
    <main className='w-full py-10 md:py-16'>
      <div className='container-custom space-y-16 md:space-y-24'>
        {/* 1. Contact Hero Showcase */}
        <section
          aria-labelledby='contact-hero-title'
          className='relative overflow-hidden rounded-3xl border border-border/80 bg-card p-8 shadow-xs sm:p-12 md:p-16'>
          <div className='pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-primary/10 blur-3xl' />
          <div className='pointer-events-none absolute -bottom-20 -left-20 size-80 rounded-full bg-accent/15 blur-3xl' />

          <div className='relative z-10 max-w-3xl space-y-6'>
            <div className='inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary'>
              <Sparkles className='size-3.5 text-primary' />
              <span>Hospital Communication Desk</span>
            </div>

            <h1
              id='contact-hero-title'
              className='text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:leading-[1.15]'>
              We Are Here for You Around the Clock
            </h1>

            <p className='text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg'>
              Whether you need urgent emergency response, doctor consultation
              guidance, or visiting information, our clinical coordination team
              is standing by to assist you.
            </p>

            <div className='flex flex-wrap items-center gap-3 pt-2'>
              <a
                href='tel:01010928888'
                className={buttonVariants({
                  className:
                    'h-11 rounded-xl bg-destructive px-6 text-xs font-bold text-white shadow-md shadow-destructive/20 hover:bg-destructive/90'
                })}>
                <Ambulance className='mr-2 size-4' />
                Emergency Line: 01010928888
              </a>
              <Link
                href='/doctors'
                className={buttonVariants({
                  variant: 'outline',
                  className:
                    'h-11 rounded-xl border-border px-6 text-xs font-bold text-foreground hover:bg-muted'
                })}>
                <CalendarCheck className='mr-2 size-4 text-primary' />
                Schedule Doctor Visit
              </Link>
            </div>
          </div>
        </section>

        {/* 2. Key Channels Cards */}
        <section
          aria-labelledby='channels-title'
          className='space-y-4'>
          <h2
            id='channels-title'
            className='sr-only'>
            Direct Contact Channels
          </h2>
          <div className='grid gap-6 md:grid-cols-3'>
            {CHANNELS.map((channel) => {
              const Icon = channel.icon
              return (
                <div
                  key={channel.title}
                  className={`flex flex-col justify-between rounded-2xl border p-6 shadow-2xs transition-all sm:p-7 ${
                    channel.highlight
                      ? 'border-destructive/40 bg-destructive/5'
                      : 'border-border/80 bg-card hover:border-primary/50'
                  }`}>
                  <div className='space-y-3'>
                    <div
                      className={`flex size-12 items-center justify-center rounded-xl ${
                        channel.highlight
                          ? 'bg-destructive/10 text-destructive'
                          : 'bg-primary/10 text-primary'
                      }`}>
                      <Icon className='size-6' />
                    </div>
                    <h3 className='text-lg font-bold text-foreground'>
                      {channel.title}
                    </h3>
                    <p className='text-xs text-muted-foreground leading-relaxed'>
                      {channel.description}
                    </p>
                    <p className='text-base font-extrabold text-foreground'>
                      {channel.contact}
                    </p>
                  </div>

                  <div className='mt-6 pt-2'>
                    {channel.href.startsWith('http') ||
                    channel.href.startsWith('/') ? (
                      <Link
                        href={channel.href}
                        className={buttonVariants({
                          variant: channel.highlight ? 'default' : 'outline',
                          className: `w-full rounded-xl text-xs font-bold ${
                            channel.highlight
                              ? 'bg-destructive text-white hover:bg-destructive/90'
                              : 'border-border'
                          }`
                        })}>
                        {channel.actionText}
                      </Link>
                    ) : (
                      <a
                        href={channel.href}
                        className={buttonVariants({
                          variant: channel.highlight ? 'default' : 'outline',
                          className: `w-full rounded-xl text-xs font-bold ${
                            channel.highlight
                              ? 'bg-destructive text-white hover:bg-destructive/90'
                              : 'border-border'
                          }`
                        })}>
                        {channel.actionText}
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* 3. Main Grid: Campus Locations & Department Directory */}
        <section
          aria-labelledby='locations-title'
          className='grid gap-8 lg:grid-cols-2'>
          {/* Left Column: Campus Info & Visiting Hours */}
          <div className='rounded-3xl border border-border/80 bg-card p-8 shadow-xs sm:p-10 space-y-8'>
            <div>
              <div className='inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary'>
                <Building2 className='size-3.5' />
                <span>Central Campus</span>
              </div>
              <h2
                id='locations-title'
                className='mt-2 text-2xl font-extrabold tracking-tight text-foreground'>
                Life Hospital Main Medical Complex
              </h2>
              <p className='mt-1 text-xs text-muted-foreground leading-relaxed'>
                A modern 450-bed healthcare campus located in the heart of the
                city with designated patient parking and ambulance bays.
              </p>
            </div>

            <div className='space-y-4 border-y border-border/60 py-6 text-xs'>
              <div className='flex items-start gap-3'>
                <MapPin className='size-4 text-primary shrink-0 mt-0.5' />
                <div>
                  <span className='font-bold text-foreground'>Address:</span>
                  <p className='text-muted-foreground mt-0.5'>
                    100 Health Avenue, Central Medical District, Suite 500
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-3'>
                <Clock className='size-4 text-primary shrink-0 mt-0.5' />
                <div>
                  <span className='font-bold text-foreground'>
                    Visiting Hours:
                  </span>
                  <p className='text-muted-foreground mt-0.5'>
                    General Inpatient: 10:00 AM – 1:00 PM & 4:00 PM – 8:00 PM
                    daily
                  </p>
                  <p className='text-muted-foreground'>
                    ICU & High Dependency: 5:00 PM – 6:00 PM (1 family member)
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-3'>
                <ShieldCheck className='size-4 text-primary shrink-0 mt-0.5' />
                <div>
                  <span className='font-bold text-foreground'>
                    Patient Parking:
                  </span>
                  <p className='text-muted-foreground mt-0.5'>
                    Complimentary 3-hour underground parking for verified
                    patient families.
                  </p>
                </div>
              </div>
            </div>

            {/* Department Extensions Directory */}
            <div className='space-y-3'>
              <p className='text-xs font-bold uppercase tracking-wider text-foreground'>
                Direct Department Extensions:
              </p>
              <div className='grid grid-cols-1 gap-2.5 sm:grid-cols-2'>
                {DEPARTMENTS.map((dept) => (
                  <div
                    key={dept.name}
                    className='flex items-center justify-between rounded-xl border border-border/70 bg-muted/20 px-3.5 py-2.5 text-xs'>
                    <span className='text-foreground font-medium'>
                      {dept.name}
                    </span>
                    <span className='font-bold text-primary font-mono text-[11px]'>
                      {dept.ext}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry & Feedback Form */}
          <div className='rounded-3xl border border-border/80 bg-card p-8 shadow-xs sm:p-10 space-y-6'>
            <div>
              <Badge
                variant='outline'
                className='border-primary/30 bg-primary/5 text-xs font-bold text-primary'>
                Patient Inquiries
              </Badge>
              <h2 className='mt-2 text-2xl font-extrabold tracking-tight text-foreground'>
                Send Us a Message
              </h2>
              <p className='mt-1 text-xs text-muted-foreground leading-relaxed'>
                Have questions about treatments, tests, or admission? Fill out
                the form below and our coordination team will reply within 24
                hours.
              </p>
            </div>

            <ContactInquiryForm />
          </div>
        </section>

        {/* 4. Critical Emergency Notice Box */}
        <section
          aria-labelledby='notice-title'
          className='flex items-start gap-4 rounded-2xl border border-amber-200/80 bg-amber-50/60 p-6 text-foreground shadow-2xs dark:border-amber-900/50 dark:bg-amber-950/20'>
          <AlertCircle className='size-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5' />
          <div className='space-y-1 text-xs'>
            <h3
              id='notice-title'
              className='font-bold text-foreground text-sm'>
              Emergency Medical Notice
            </h3>
            <p className='text-muted-foreground leading-relaxed'>
              If you or someone in your care is experiencing acute chest pain,
              uncontrolled bleeding, severe breathing difficulty, sudden
              numbness, or major physical trauma, do not submit an online form.
              Call emergency immediately at{' '}
              <span className='font-bold text-foreground'>01010928888</span> or
              proceed straight to our 24/7 Trauma Emergency Care entrance.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
