'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  CheckCircle2,
  Mail,
  MapPin,
  PhoneCall,
  Send,
  ShieldCheck
} from 'lucide-react'
import React, { useState } from 'react'

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'General Consultation',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({
        name: '',
        email: '',
        phone: '',
        department: 'General Consultation',
        message: ''
      })
    }, 4000)
  }

  return (
    <section
      id='contact'
      aria-labelledby='contact-title'
      className='w-full py-16 md:py-24'>
      <div className='container-custom'>
        <div className='rounded-[32px] border border-border/80 bg-card p-6 shadow-[0_8px_35px_rgba(0,0,0,0.03)] sm:p-10 md:rounded-[40px] md:p-12 lg:p-16'>
        <div className='grid items-start gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-14 xl:gap-20'>
          {/* Left Column: Framer-style Contact Information Stack */}
          <div>
            <div className='inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary'>
              <span className='size-2 rounded-full bg-accent' />
              Get in Touch
            </div>

            <h2
              id='contact-title'
              className='mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-[44px] lg:leading-[1.15]'>
              We&apos;re here for you. <br />
              <span className='text-primary'>Let&apos;s talk</span> about your
              care.
            </h2>

            <p className='mt-4 max-w-lg text-base leading-relaxed text-muted-foreground'>
              Whether you need urgent emergency triage, routine clinical
              consultations, or specialized inpatient care, our medical
              coordinators are available 24/7.
            </p>

            {/* Tactile Contact Channels */}
            <div className='mt-8 space-y-3.5'>
              {/* Phone Channel */}
              <a
                href='tel:01010928888'
                className='group flex items-start gap-4 rounded-2xl border border-border/70 bg-background/50 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5 hover:shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'>
                <div className='flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white'>
                  <PhoneCall
                    className='size-5'
                    aria-hidden='true'
                  />
                </div>
                <div>
                  <p className='text-xs font-bold uppercase tracking-wider text-muted-foreground'>
                    Call us directly
                  </p>
                  <p className='text-base font-bold text-foreground transition-colors group-hover:text-primary'>
                    010-1092-8888
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    24/7 Emergency response & appointment desk
                  </p>
                </div>
              </a>

              {/* Email Channel */}
              <a
                href='mailto:care@lifehospital.com'
                className='group flex items-start gap-4 rounded-2xl border border-border/70 bg-background/50 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5 hover:shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'>
                <div className='flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white'>
                  <Mail
                    className='size-5'
                    aria-hidden='true'
                  />
                </div>
                <div>
                  <p className='text-xs font-bold uppercase tracking-wider text-muted-foreground'>
                    Email our coordinators
                  </p>
                  <p className='text-base font-bold text-foreground transition-colors group-hover:text-primary'>
                    care@lifehospital.com
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    Typically replies within 2 hours
                  </p>
                </div>
              </a>

              {/* Campus Location */}
              <div className='flex items-start gap-4 rounded-2xl border border-border/70 bg-background/50 p-4'>
                <div className='flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary'>
                  <MapPin
                    className='size-5'
                    aria-hidden='true'
                  />
                </div>
                <div>
                  <p className='text-xs font-bold uppercase tracking-wider text-muted-foreground'>
                    Central Hospital Campus
                  </p>
                  <p className='text-base font-bold text-foreground'>
                    Life Hospital Complex
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    100 Health Avenue, Central Medical District
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Framer Form Card */}
          <div className='rounded-[26px] border border-border/80 bg-[#f8fafc] p-6 shadow-xs sm:p-8'>
            <h3 className='text-xl font-bold tracking-tight text-foreground sm:text-2xl'>
              Send us a message
            </h3>
            <p className='mt-1 text-xs text-muted-foreground'>
              Fill out the details below and an admissions coordinator will
              follow up promptly.
            </p>

            <form
              onSubmit={handleSubmit}
              className='mt-6 space-y-4'>
              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-foreground'>
                    Your Name <span className='text-destructive'>*</span>
                  </label>
                  <Input
                    required
                    placeholder='e.g. John Doe'
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className='h-11 rounded-xl border-border/80 bg-card px-3.5 focus-visible:border-primary'
                  />
                </div>

                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-foreground'>
                    Email Address <span className='text-destructive'>*</span>
                  </label>
                  <Input
                    type='email'
                    required
                    placeholder='john@example.com'
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className='h-11 rounded-xl border-border/80 bg-card px-3.5 focus-visible:border-primary'
                  />
                </div>
              </div>

              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-foreground'>
                    Phone Number
                  </label>
                  <Input
                    type='tel'
                    placeholder='010-0000-0000'
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className='h-11 rounded-xl border-border/80 bg-card px-3.5 focus-visible:border-primary'
                  />
                </div>

                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-foreground'>
                    Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        department: e.target.value
                      })
                    }
                    className='h-11 w-full rounded-xl border border-input bg-card px-3 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50'>
                    <option value='General Consultation'>
                      General Consultation
                    </option>
                    <option value='Emergency & ICU'>Emergency & ICU</option>
                    <option value='Cardiology'>Cardiology</option>
                    <option value='Neurology'>Neurology</option>
                    <option value='Orthopedics'>Orthopedics</option>
                    <option value='Pediatrics'>Pediatrics</option>
                    <option value='Gynecology'>Gynecology</option>
                  </select>
                </div>
              </div>

              <div className='space-y-1.5'>
                <label className='text-xs font-bold text-foreground'>
                  How can we help? <span className='text-destructive'>*</span>
                </label>
                <Textarea
                  required
                  rows={4}
                  placeholder='Describe your symptoms, appointment request, or general inquiry...'
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className='min-h-[100px] rounded-xl border-border/80 bg-card p-3 text-sm focus-visible:border-primary'
                />
              </div>

              <Button
                type='submit'
                className='h-12 w-full rounded-xl bg-primary text-sm font-bold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30'>
                {submitted ? (
                  <span className='inline-flex items-center gap-2 text-accent'>
                    <CheckCircle2
                      className='size-4'
                      aria-hidden='true'
                    />
                    Message Sent Successfully
                  </span>
                ) : (
                  <span className='inline-flex items-center gap-2'>
                    <Send
                      className='size-4'
                      aria-hidden='true'
                    />
                    Send Message
                  </span>
                )}
              </Button>

              <div className='flex items-center justify-center gap-1.5 pt-1 text-[11px] font-medium text-muted-foreground'>
                <ShieldCheck
                  className='size-3.5 text-primary'
                  aria-hidden='true'
                />
                <span>Your health data is private, secure, and encrypted.</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
  )
}

export default ContactUs
