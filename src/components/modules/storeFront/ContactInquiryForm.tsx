'use client'

import { Send } from 'lucide-react'
import type { FormEvent } from 'react'
import { toast } from 'sonner'

const ContactInquiryForm = () => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    toast.success(
      'Thank you! Your message has been received. Our team will contact you shortly.'
    )
    event.currentTarget.reset()
  }

  return (
    <form
      onSubmit={handleSubmit}
      suppressHydrationWarning
      className='space-y-4 pt-1'>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <div className='space-y-1.5'>
          <label
            htmlFor='contact-name'
            className='text-xs font-semibold text-foreground'>
            Your Full Name *
          </label>
          <input
            id='contact-name'
            name='fullName'
            autoComplete='name'
            defaultValue=''
            required
            type='text'
            placeholder='John Doe'
            suppressHydrationWarning
            className='h-11 w-full rounded-xl border border-input bg-transparent px-3 text-xs outline-none transition-colors focus:border-primary'
          />
        </div>

        <div className='space-y-1.5'>
          <label
            htmlFor='contact-email'
            className='text-xs font-semibold text-foreground'>
            Email Address *
          </label>
          <input
            id='contact-email'
            name='email'
            autoComplete='email'
            defaultValue=''
            required
            type='email'
            placeholder='john@example.com'
            suppressHydrationWarning
            className='h-11 w-full rounded-xl border border-input bg-transparent px-3 text-xs outline-none transition-colors focus:border-primary'
          />
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <div className='space-y-1.5'>
          <label
            htmlFor='contact-phone'
            className='text-xs font-semibold text-foreground'>
            Phone Number
          </label>
          <input
            id='contact-phone'
            name='phone'
            autoComplete='tel'
            defaultValue=''
            type='tel'
            placeholder='+1 (555) 000-0000'
            suppressHydrationWarning
            className='h-11 w-full rounded-xl border border-input bg-transparent px-3 text-xs outline-none transition-colors focus:border-primary'
          />
        </div>

        <div className='space-y-1.5'>
          <label
            htmlFor='contact-subject'
            className='text-xs font-semibold text-foreground'>
            Department / Topic
          </label>
          <select
            id='contact-subject'
            name='subject'
            defaultValue='general'
            suppressHydrationWarning
            className='h-11 w-full rounded-xl border border-input bg-card px-3 text-xs outline-none transition-colors focus:border-primary'>
            <option value='general'>General Inquiry</option>
            <option value='appointment'>Appointment Scheduling</option>
            <option value='billing'>Billing & Insurance Claims</option>
            <option value='diagnostics'>Diagnostic Imaging / Lab</option>
            <option value='feedback'>Patient Experience Feedback</option>
          </select>
        </div>
      </div>

      <div className='space-y-1.5'>
        <label
          htmlFor='contact-message'
          className='text-xs font-semibold text-foreground'>
          Your Message or Question *
        </label>
        <textarea
          id='contact-message'
          name='message'
          defaultValue=''
          required
          rows={4}
          placeholder='Please share your medical inquiry, preferred visit timing, or assistance required...'
          suppressHydrationWarning
          className='w-full resize-none rounded-xl border border-input bg-transparent p-3 text-xs outline-none transition-colors focus:border-primary'
        />
      </div>

      <button
        type='submit'
        suppressHydrationWarning
        className='inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary text-xs font-bold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary/90'>
        <Send className='size-4' />
        <span>Submit Inquiry</span>
      </button>
    </form>
  )
}

export default ContactInquiryForm
