import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import {
  Activity,
  Ambulance,
  ArrowRight,
  Baby,
  Brain,
  CalendarCheck,
  CheckCircle2,
  Eye,
  HeartPulse,
  HelpCircle,
  Microscope,
  PhoneCall,
  Pill,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Wind
} from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Clinical Services & Departments | Life Hospital',
  description:
    'Comprehensive healthcare services at Life Hospital: Cardiology, Neurology, Pediatrics, Orthopedics, Oncology, 24/7 Emergency Care, and Advanced Diagnostics.',
  keywords: [
    'Hospital Services',
    'Cardiology',
    'Neurology',
    'Pediatrics',
    'Orthopedics',
    'Emergency Trauma ICU',
    'Clinical Specialties',
    'Diagnostics'
  ],
  openGraph: {
    title: 'Medical Services & Specialities - Life Hospital',
    description:
      'From preventive screenings to advanced surgical interventions, discover our multidisciplinary departments.'
  }
}

const HIGHLIGHTS = [
  { value: '18+', label: 'Clinical Departments', icon: Stethoscope },
  { value: '24/7', label: 'Trauma & Emergency ICU', icon: Ambulance },
  { value: '45+', label: 'Diagnostic Procedures', icon: Microscope },
  { value: '100%', label: 'Digital Prescriptions', icon: Pill }
]

const SERVICES = [
  {
    id: 'cardiology',
    title: 'Cardiology & Heart Care',
    category: 'Surgical & Inpatient',
    icon: HeartPulse,
    badge: 'High Acuity Care',
    description:
      'Comprehensive cardiac disease diagnosis, catheterization, coronary angioplasty, pacemaker implantation, and preventative cardiovascular rehabilitation.',
    procedures: [
      'Echocardiography (ECG/EKG)',
      'Coronary Angiography',
      'Cardiac Stenting',
      'Heart Failure Clinic'
    ]
  },
  {
    id: 'neurology',
    title: 'Neurology & Neurosurgery',
    category: 'Specialized Center',
    icon: Brain,
    badge: 'Advanced Imaging',
    description:
      'Pioneering stroke management, epilepsy diagnostics, neuro-oncology, minimally invasive spine surgery, and comprehensive nerve conduction studies.',
    procedures: [
      'Stroke Intervention ICU',
      'Spine & Disc Microsurgery',
      'EEG & EMG Nerve Studies',
      'Parkinson’s Therapy'
    ]
  },
  {
    id: 'pediatrics',
    title: 'Pediatrics & Neonatal ICU',
    category: 'Maternal & Child',
    icon: Baby,
    badge: 'Level-3 NICU',
    description:
      'Child-centered outpatient consultation, adolescent medicine, neonatal intensive care units, developmental screening, and routine pediatric vaccination.',
    procedures: [
      'Newborn Intensive Care',
      'Pediatric Surgery',
      'Child Immunization',
      'Growth & Developmental Clinics'
    ]
  },
  {
    id: 'orthopedics',
    title: 'Orthopedics & Joint Care',
    category: 'Surgery & Rehab',
    icon: Activity,
    badge: 'Robotic Assisted',
    description:
      'Minimally invasive total hip and knee joint replacement, sports injury arthroscopy, fracture stabilization, and specialized physical rehabilitation.',
    procedures: [
      'Total Joint Replacement',
      'Arthroscopic Surgery',
      'Spine Injury Recovery',
      'Physiotherapy Center'
    ]
  },
  {
    id: 'emergency',
    title: '24/7 Emergency & Critical Care',
    category: 'Immediate Care',
    icon: Ambulance,
    badge: 'Zero Delay Triage',
    description:
      'Fully equipped level-1 trauma emergency center, advanced ambulance dispatch fleets, cardiac resuscitation suites, and 24-hour surgical teams.',
    procedures: [
      'Emergency Resuscitation',
      'Trauma Surgery',
      'Intensive Care Unit (ICU)',
      'Ambulance Dispatch'
    ]
  },
  {
    id: 'pulmonology',
    title: 'Pulmonology & Respiratory',
    category: 'Internal Medicine',
    icon: Wind,
    badge: 'Clean Air Protocols',
    description:
      'Diagnostic bronchoscopy, chronic asthma and COPD control, post-pneumonia pulmonary rehabilitation, and overnight sleep apnea evaluation.',
    procedures: [
      'Pulmonary Function Test (PFT)',
      'Diagnostic Bronchoscopy',
      'Sleep Disorder Study',
      'Asthma Center'
    ]
  },
  {
    id: 'ophthalmology',
    title: 'Ophthalmology & Eye Surgery',
    category: 'Day Surgery',
    icon: Eye,
    badge: 'Laser Precision',
    description:
      'Micro-incision cataract operations, glaucoma monitoring, diabetic retinopathy treatment, and computer vision ergonomic diagnostics.',
    procedures: [
      'Laser Cataract Extraction',
      'Glaucoma Treatment',
      'Retinal Photography',
      'Pediatric Vision Exams'
    ]
  },
  {
    id: 'diagnostics',
    title: 'Diagnostic Imaging & Pathology',
    category: 'Clinical Lab',
    icon: Microscope,
    badge: 'Same-Day Reports',
    description:
      'Equipped with 3T MRI, 128-slice dual-source CT scanning, digital 3D mammography, high-resolution ultrasound, and certified laboratory pathology.',
    procedures: [
      'High-Definition 3T MRI',
      '128-Slice Spiral CT',
      'Digital Radiography (X-Ray)',
      'Biochemical Blood Lab'
    ]
  }
]

const FAQS = [
  {
    q: 'How do I book a consultation with a specialist doctor?',
    a: 'You can browse our verified medical specialists on the Doctors directory page, choose your preferred consultation date and available time slot, and reserve your visit online with zero wait time.'
  },
  {
    q: 'Does Life Hospital accept medical health insurance plans?',
    a: 'Yes, Life Hospital partners with major domestic and international health insurance providers. Our billing counter assists with direct cashless claims and coverage pre-authorizations.'
  },
  {
    q: 'How does the 24/7 emergency trauma admission work?',
    a: 'Our emergency room is open 24 hours a day, 365 days a year without prior appointment. Our triage physicians evaluate patients immediately upon arrival based on clinical urgency.'
  },
  {
    q: 'Can I access my diagnostic reports and prescriptions digitally?',
    a: 'Yes! Registered patients can access all verified consultation prescriptions, diagnostic laboratory reports, and appointment history securely through their Patient Portal.'
  }
]

export default function ServicesPage() {
  return (
    <main className='w-full py-10 md:py-16'>
      <div className='container-custom space-y-16 md:space-y-24'>
        {/* 1. Services Hero Banner */}
        <section
          aria-labelledby='services-hero-title'
          className='relative overflow-hidden rounded-3xl border border-border/80 bg-card p-8 shadow-xs sm:p-12 md:p-16'>
          <div className='pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-primary/10 blur-3xl' />
          <div className='pointer-events-none absolute -bottom-20 -left-20 size-80 rounded-full bg-accent/15 blur-3xl' />

          <div className='relative z-10 max-w-3xl space-y-6'>
            <div className='inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary'>
              <Sparkles className='size-3.5 text-primary' />
              <span>Comprehensive Healthcare</span>
            </div>

            <h1
              id='services-hero-title'
              className='text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:leading-[1.15]'>
              Expert Medical Specialties Driven by Advanced Clinical Technology
            </h1>

            <p className='text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg'>
              From preventive family consultations to complex cardiothoracic and
              neurosurgical procedures, Life Hospital provides unified
              healthcare tailored to each stage of your recovery.
            </p>

            <div className='flex flex-wrap items-center gap-3 pt-2'>
              <Link
                href='/doctors'
                className={buttonVariants({
                  className:
                    'h-11 rounded-xl bg-primary px-6 text-xs font-bold text-white shadow-md shadow-primary/20 hover:bg-primary/90'
                })}>
                <CalendarCheck className='mr-2 size-4' />
                Find Department Specialist
              </Link>
              <Link
                href='/contact'
                className={buttonVariants({
                  variant: 'outline',
                  className:
                    'h-11 rounded-xl border-border px-6 text-xs font-bold text-foreground hover:bg-muted'
                })}>
                <PhoneCall className='mr-2 size-4 text-primary' />
                Emergency Hotline (24/7)
              </Link>
            </div>
          </div>
        </section>

        {/* 2. Department Quick Metrics Bar */}
        <section
          aria-labelledby='metrics-title'
          className='space-y-4'>
          <h2
            id='metrics-title'
            className='sr-only'>
            Clinical Capacity Metrics
          </h2>
          <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
            {HIGHLIGHTS.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.label}
                  className='flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 shadow-2xs sm:p-7'>
                  <div className='flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary'>
                    <Icon className='size-5' />
                  </div>
                  <div className='mt-4'>
                    <p className='text-2xl font-black tracking-tight text-foreground sm:text-3xl'>
                      {item.value}
                    </p>
                    <p className='mt-1 text-xs font-medium text-muted-foreground'>
                      {item.label}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* 3. Core Clinical Departments Grid */}
        <section
          aria-labelledby='departments-title'
          className='space-y-8'>
          <div className='flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
            <div>
              <p className='text-xs font-bold uppercase tracking-wider text-primary'>
                Medical Specialties
              </p>
              <h2
                id='departments-title'
                className='text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl'>
                Our Specialized Medical Departments
              </h2>
            </div>
            <p className='max-w-md text-xs text-muted-foreground sm:text-right'>
              Each unit is equipped with dedicated surgical suites, intensive
              care monitors, and board-certified medical faculty.
            </p>
          </div>

          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {SERVICES.map((service) => {
              const Icon = service.icon
              return (
                <div
                  key={service.id}
                  className='group flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 shadow-2xs transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-md'>
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <div className='flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white'>
                        <Icon className='size-6' />
                      </div>
                      <Badge
                        variant='outline'
                        className='border-primary/20 bg-primary/5 text-[10px] font-bold text-primary'>
                        {service.badge}
                      </Badge>
                    </div>

                    <div>
                      <p className='text-[11px] font-bold uppercase tracking-wider text-muted-foreground'>
                        {service.category}
                      </p>
                      <h3 className='mt-1 text-lg font-bold text-foreground'>
                        {service.title}
                      </h3>
                      <p className='mt-2 text-xs leading-relaxed text-muted-foreground'>
                        {service.description}
                      </p>
                    </div>

                    <div className='space-y-1.5 border-t border-border/60 pt-3'>
                      <p className='text-[10px] font-bold uppercase tracking-wider text-foreground'>
                        Key Procedures:
                      </p>
                      <ul className='space-y-1 text-xs text-muted-foreground'>
                        {service.procedures.map((proc) => (
                          <li
                            key={proc}
                            className='flex items-center gap-1.5'>
                            <CheckCircle2 className='size-3 text-primary shrink-0' />
                            <span className='truncate'>{proc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className='mt-6 pt-2'>
                    <Link
                      href='/doctors'
                      className='inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-border bg-card py-2 text-xs font-bold text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary'>
                      <span>Consult Department Doctor</span>
                      <ArrowRight className='size-3.5' />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* 4. Clinical Care Protocol: How We Work */}
        <section
          aria-labelledby='protocol-title'
          className='rounded-3xl border border-border/80 bg-[#f8fafc] p-8 shadow-xs sm:p-12 md:p-16 space-y-8'>
          <div className='text-center sm:mx-auto sm:max-w-2xl'>
            <Badge
              variant='outline'
              className='border-primary/30 bg-primary/5 text-xs font-bold text-primary'>
              Care Journey
            </Badge>
            <h2
              id='protocol-title'
              className='mt-3 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl'>
              A Seamless Patient Experience from Triage to Recovery
            </h2>
            <p className='mt-2 text-xs text-muted-foreground sm:text-sm'>
              Designed to eliminate clinic waiting times and guarantee clear
              communication at every touchpoint.
            </p>
          </div>

          <div className='grid gap-6 md:grid-cols-3'>
            <div className='rounded-2xl border border-border/70 bg-card p-6 shadow-2xs space-y-3'>
              <div className='flex size-10 items-center justify-center rounded-xl bg-primary text-white font-extrabold text-sm'>
                01
              </div>
              <h3 className='text-base font-bold text-foreground'>
                Doctor Scheduling & Intake
              </h3>
              <p className='text-xs leading-relaxed text-muted-foreground'>
                Select your specialist online, pick a dedicated consultation
                hour, and submit symptoms in advance through our secure portal.
              </p>
            </div>

            <div className='rounded-2xl border border-border/70 bg-card p-6 shadow-2xs space-y-3'>
              <div className='flex size-10 items-center justify-center rounded-xl bg-primary text-white font-extrabold text-sm'>
                02
              </div>
              <h3 className='text-base font-bold text-foreground'>
                Comprehensive Clinical Evaluation
              </h3>
              <p className='text-xs leading-relaxed text-muted-foreground'>
                In-depth medical consultation supported by rapid on-site
                diagnostic imaging and collaborative multidisciplinary review.
              </p>
            </div>

            <div className='rounded-2xl border border-border/70 bg-card p-6 shadow-2xs space-y-3'>
              <div className='flex size-10 items-center justify-center rounded-xl bg-primary text-white font-extrabold text-sm'>
                03
              </div>
              <h3 className='text-base font-bold text-foreground'>
                Digital Follow-Up & Recovery
              </h3>
              <p className='text-xs leading-relaxed text-muted-foreground'>
                Access your digital prescription, monitor follow-up schedule
                alerts, and connect with your doctor for ongoing healing.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Patient FAQs */}
        <section
          aria-labelledby='faqs-title'
          className='space-y-8'>
          <div className='text-center sm:mx-auto sm:max-w-2xl'>
            <div className='inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary'>
              <HelpCircle className='size-3.5' />
              <span>Common Questions</span>
            </div>
            <h2
              id='faqs-title'
              className='mt-3 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl'>
              Frequently Asked Questions About Our Services
            </h2>
          </div>

          <div className='grid gap-4 md:grid-cols-2'>
            {FAQS.map((faq) => (
              <div
                key={faq.q}
                className='rounded-2xl border border-border/80 bg-card p-6 shadow-2xs space-y-2'>
                <h3 className='text-sm font-bold text-foreground'>{faq.q}</h3>
                <p className='text-xs leading-relaxed text-muted-foreground'>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Emergency & Booking Action Banner */}
        <section
          aria-labelledby='services-cta-title'
          className='rounded-3xl bg-primary p-8 text-white shadow-xl sm:p-12 md:p-16'>
          <div className='flex flex-col items-start justify-between gap-8 md:flex-row md:items-center'>
            <div className='max-w-xl space-y-3'>
              <div className='inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white'>
                <ShieldCheck className='size-3.5' />
                Verified Hospital Care
              </div>
              <h2
                id='services-cta-title'
                className='text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl text-white'>
                Need Medical Consultation or Urgent Care?
              </h2>
              <p className='text-xs sm:text-sm text-white/80 leading-relaxed'>
                Schedule an in-person appointment with our specialist physicians
                or call our clinical triage desk for immediate guidance.
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
                Book a Consultation
              </Link>
              <a
                href='tel:01010928888'
                className={buttonVariants({
                  variant: 'outline',
                  className:
                    'h-12 rounded-xl border-white/30 bg-transparent px-6 text-xs font-bold text-white hover:bg-white/10'
                })}>
                Call Reception (01010928888)
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
