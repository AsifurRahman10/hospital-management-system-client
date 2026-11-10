'use client'

import { buttonVariants } from '@/components/ui/button'
import { IDoctorDetails } from '@/types/doctor.types'
import { format } from 'date-fns'
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  GraduationCap,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
  Stethoscope,
  User
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { isValidDoctorImage } from './DoctorCard'

export interface DoctorDetailsViewProps {
  doctor: IDoctorDetails
}

export const DoctorDetailsView = ({ doctor }: DoctorDetailsViewProps) => {
  const [activeTab, setActiveTab] = useState<'about' | 'schedules' | 'reviews'>(
    'about'
  )

  const hasValidImage = isValidDoctorImage(doctor.profilePhoto)
  const averageRating =
    doctor.reviews && doctor.reviews.length > 0
      ? doctor.reviews.reduce((sum, r) => sum + (r.rating ?? 0), 0) /
        doctor.reviews.length
      : doctor.averageRating ?? 5.0

  const schedules = doctor.doctorSchedules ?? []
  const reviews = doctor.reviews ?? []

  const formatScheduleDateTime = (dateVal?: string | Date) => {
    if (!dateVal) return 'Time not specified'
    try {
      const d = new Date(dateVal)
      return format(d, 'EEE, MMM dd, yyyy · hh:mm a')
    } catch {
      return String(dateVal)
    }
  }

  return (
    <div className='w-full px-4 py-8 md:py-12'>
      <div className='mx-auto max-w-3/4 space-y-8'>
        {/* Back Link & Breadcrumb */}
        <div className='flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground'>
          <Link
            href='/doctors'
            className='inline-flex items-center gap-1.5 font-bold text-primary transition-colors hover:text-primary/80'>
            <ArrowLeft className='size-4' />
            <span>Back to all doctors</span>
          </Link>

          <div className='flex items-center gap-1.5 font-medium'>
            <Link
              href='/'
              className='hover:text-foreground'>
              Home
            </Link>
            <span>/</span>
            <Link
              href='/doctors'
              className='hover:text-foreground'>
              Doctors
            </Link>
            <span>/</span>
            <span className='font-bold text-foreground'>{doctor.name}</span>
          </div>
        </div>

        {/* Doctor Header Showcase Card */}
        <div className='rounded-[32px] border border-border/80 bg-card p-6 shadow-xs sm:p-8 md:p-10'>
          <div className='flex flex-col gap-8 md:flex-row md:items-center'>
            {/* Doctor Portrait */}
            <div className='relative size-44 shrink-0 overflow-hidden rounded-[24px] border border-border/70 bg-muted shadow-sm sm:size-52 md:size-60'>
              {hasValidImage ? (
                <Image
                  src={doctor.profilePhoto!}
                  alt={doctor.name || 'Doctor'}
                  fill
                  priority
                  sizes='(max-width: 640px) 176px, 240px'
                  className='object-cover'
                />
              ) : (
                <div className='flex size-full items-center justify-center bg-secondary/50 text-primary/60'>
                  <User
                    className='size-20'
                    aria-hidden='true'
                  />
                </div>
              )}

              {/* Status pill overlay */}
              <div className='absolute bottom-3 left-3 right-3 flex items-center justify-center gap-1.5 rounded-full border border-white/60 bg-white/95 px-3 py-1 text-[11px] font-bold text-foreground shadow-xs backdrop-blur-md'>
                <span className='size-2 rounded-full bg-emerald-500' />
                <span>Accepting Appointments</span>
              </div>
            </div>

            {/* Doctor Basic Information */}
            <div className='flex-1 space-y-4'>
              <div className='flex flex-wrap items-center gap-2'>
                {doctor.doctorSpecialties && doctor.doctorSpecialties.length > 0 ? (
                  doctor.doctorSpecialties.map((ds) => (
                    <span
                      key={ds.specialtyId || ds.specialty?.id}
                      className='rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary'>
                      {ds.specialty?.title}
                    </span>
                  ))
                ) : (
                  <span className='rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary'>
                    {doctor.designation || 'Specialist Physician'}
                  </span>
                )}

                <span className='inline-flex items-center gap-1 text-xs font-medium text-muted-foreground'>
                  <ShieldCheck className='size-3.5 text-primary' />
                  Verified Hospital Specialist
                </span>
              </div>

              <div>
                <h1 className='text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl md:text-4xl'>
                  {doctor.name}
                </h1>
                <p className='mt-1 text-base font-semibold text-foreground/80'>
                  {doctor.designation || 'Senior Consultant'}
                </p>
                {doctor.qualifications && (
                  <p className='text-sm text-muted-foreground'>
                    {doctor.qualifications}
                  </p>
                )}
              </div>

              {doctor.currentWorkplace && (
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <Briefcase className='size-4 shrink-0 text-primary' />
                  <span>{doctor.currentWorkplace}</span>
                </div>
              )}

              {/* 4 Stat Highlights */}
              <div className='grid grid-cols-2 gap-3 border-t border-border/60 pt-4 sm:grid-cols-4 sm:gap-4'>
                <div className='rounded-xl border border-border/50 bg-[#f8fafc] p-2.5 text-center'>
                  <div className='flex items-center justify-center gap-1 text-amber-500'>
                    <Star className='size-4 fill-amber-400' />
                    <span className='text-sm font-extrabold text-foreground'>
                      {averageRating.toFixed(1)}
                    </span>
                  </div>
                  <p className='mt-0.5 text-[11px] text-muted-foreground'>
                    {reviews.length} Patient Reviews
                  </p>
                </div>

                <div className='rounded-xl border border-border/50 bg-[#f8fafc] p-2.5 text-center'>
                  <p className='text-sm font-extrabold text-foreground'>
                    {doctor.experience ?? 5}+ Yrs
                  </p>
                  <p className='mt-0.5 text-[11px] text-muted-foreground'>
                    Clinical Experience
                  </p>
                </div>

                <div className='rounded-xl border border-border/50 bg-[#f8fafc] p-2.5 text-center'>
                  <p className='text-sm font-extrabold text-primary'>
                    {doctor.appointmentFee ? `$${doctor.appointmentFee}` : 'Inquire'}
                  </p>
                  <p className='mt-0.5 text-[11px] text-muted-foreground'>
                    Consultation Fee
                  </p>
                </div>

                <div className='rounded-xl border border-border/50 bg-[#f8fafc] p-2.5 text-center'>
                  <p className='truncate text-xs font-bold text-foreground'>
                    #{doctor.registrationNumber}
                  </p>
                  <p className='mt-0.5 text-[11px] text-muted-foreground'>
                    License Number
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Content Layout: In-Depth Details (Left) + Sticky Booking Card (Right) */}
        <div className='grid items-start gap-8 lg:grid-cols-[1.85fr_1.15fr]'>
          {/* Left Column: Tabbed Information Sections */}
          <div className='space-y-6'>
            {/* Tab Navigation Controls */}
            <div className='flex items-center gap-2 border-b border-border/80 pb-2'>
              <button
                type='button'
                onClick={() => setActiveTab('about')}
                className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                  activeTab === 'about'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                }`}>
                About & Qualifications
              </button>

              <button
                type='button'
                onClick={() => setActiveTab('schedules')}
                className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                  activeTab === 'schedules'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                }`}>
                Available Slots ({schedules.length})
              </button>

              <button
                type='button'
                onClick={() => setActiveTab('reviews')}
                className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                  activeTab === 'reviews'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                }`}>
                Reviews ({reviews.length})
              </button>
            </div>

            {/* Tab 1: About Doctor */}
            {activeTab === 'about' && (
              <div className='space-y-6 rounded-[28px] border border-border/80 bg-card p-6 shadow-xs sm:p-8'>
                <div>
                  <h2 className='text-lg font-bold text-foreground'>
                    Clinical Profile & Overview
                  </h2>
                  <p className='mt-3 text-sm leading-relaxed text-muted-foreground'>
                    {doctor.name} is a highly accomplished {doctor.designation} at{' '}
                    {doctor.currentWorkplace || 'Life Hospital'}. With over{' '}
                    {doctor.experience ?? 5} years of specialized practice, Dr.{' '}
                    {doctor.name} provides comprehensive diagnostic evaluations,
                    personalized treatment regimens, and patient-centered
                    clinical consultations.
                  </p>
                </div>

                {doctor.qualifications && (
                  <div className='border-t border-border/60 pt-5'>
                    <h3 className='flex items-center gap-2 text-sm font-bold text-foreground'>
                      <GraduationCap className='size-4 text-primary' />
                      Medical Qualifications & Degrees
                    </h3>
                    <p className='mt-2 text-sm text-muted-foreground'>
                      {doctor.qualifications}
                    </p>
                  </div>
                )}

                <div className='border-t border-border/60 pt-5'>
                  <h3 className='flex items-center gap-2 text-sm font-bold text-foreground'>
                    <Stethoscope className='size-4 text-primary' />
                    Clinical Specialties
                  </h3>
                  <div className='mt-3 flex flex-wrap gap-2'>
                    {doctor.doctorSpecialties?.map((ds) => (
                      <span
                        key={ds.specialtyId || ds.specialty?.id}
                        className='rounded-xl border border-border bg-[#f8fafc] px-3 py-1.5 text-xs font-semibold text-foreground'>
                        {ds.specialty?.title}
                      </span>
                    ))}
                  </div>
                </div>

                <div className='border-t border-border/60 pt-5'>
                  <h3 className='flex items-center gap-2 text-sm font-bold text-foreground'>
                    <MapPin className='size-4 text-primary' />
                    Department & Facility
                  </h3>
                  <p className='mt-2 text-sm text-muted-foreground'>
                    {doctor.address ||
                      '100 Health Avenue, Life Hospital Main Building, Consultation Wing'}
                  </p>
                </div>
              </div>
            )}

            {/* Tab 2: Available Schedules */}
            {activeTab === 'schedules' && (
              <div className='rounded-[28px] border border-border/80 bg-card p-6 shadow-xs sm:p-8'>
                <div className='flex items-center justify-between'>
                  <h2 className='text-lg font-bold text-foreground'>
                    Doctor Consultation Schedules
                  </h2>
                  <span className='text-xs font-semibold text-muted-foreground'>
                    {schedules.length} slots found
                  </span>
                </div>

                {schedules.length > 0 ? (
                  <div className='mt-6 space-y-3'>
                    {schedules.map((item, idx) => {
                      const isBooked = item.isBooked
                      const start = item.schedule?.startDateTime
                      const end = item.schedule?.endDateTime

                      return (
                        <div
                          key={item.id || idx}
                          className='flex flex-col gap-3 rounded-2xl border border-border/70 bg-[#f8fafc] p-4 transition-all sm:flex-row sm:items-center sm:justify-between'>
                          <div className='flex items-center gap-3'>
                            <div className='flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary'>
                              <Clock className='size-5' />
                            </div>
                            <div>
                              <p className='text-sm font-bold text-foreground'>
                                {formatScheduleDateTime(start)}
                              </p>
                              {end && (
                                <p className='text-xs text-muted-foreground'>
                                  Until {formatScheduleDateTime(end)}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className='flex items-center gap-3'>
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                                isBooked
                                  ? 'bg-muted text-muted-foreground'
                                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              }`}>
                              {isBooked ? 'Booked' : 'Available'}
                            </span>

                            {!isBooked && (
                              <Link
                                href='/#contact'
                                className={buttonVariants({
                                  size: 'sm',
                                  className:
                                    'rounded-xl bg-primary text-xs font-bold text-white shadow-xs hover:bg-primary/90'
                                })}>
                                Reserve Slot
                              </Link>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className='mt-6 rounded-2xl border border-border/60 bg-[#f8fafc] p-8 text-center'>
                    <Calendar className='mx-auto size-8 text-muted-foreground' />
                    <h3 className='mt-3 text-base font-bold text-foreground'>
                      No online slots currently listed
                    </h3>
                    <p className='mt-1 text-xs text-muted-foreground'>
                      Dr. {doctor.name} is available for direct clinic
                      scheduling. Call our 24/7 reception desk to confirm walk-in
                      or priority slots.
                    </p>
                    <a
                      href='tel:01010928888'
                      className='mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-primary/90'>
                      <Phone className='size-3.5' />
                      Call Clinic: 010-1092-8888
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Reviews */}
            {activeTab === 'reviews' && (
              <div className='rounded-[28px] border border-border/80 bg-card p-6 shadow-xs sm:p-8'>
                <div className='flex items-center justify-between'>
                  <h2 className='text-lg font-bold text-foreground'>
                    Patient Reviews & Ratings
                  </h2>
                  <div className='flex items-center gap-1 text-amber-500'>
                    <Star className='size-4 fill-amber-400' />
                    <span className='text-sm font-extrabold text-foreground'>
                      {averageRating.toFixed(1)} / 5.0
                    </span>
                  </div>
                </div>

                {reviews.length > 0 ? (
                  <div className='mt-6 space-y-4'>
                    {reviews.map((review, idx) => (
                      <div
                        key={review.id || idx}
                        className='rounded-2xl border border-border/60 bg-[#f8fafc] p-4 space-y-2'>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-1'>
                            {Array.from({ length: 5 }).map((_, s) => (
                              <Star
                                key={s}
                                className={`size-3.5 ${
                                  s < (review.rating ?? 5)
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-muted-foreground/30'
                                }`}
                              />
                            ))}
                          </div>
                          {review.createdAt && (
                            <span className='text-[11px] text-muted-foreground'>
                              {format(new Date(review.createdAt), 'MMM dd, yyyy')}
                            </span>
                          )}
                        </div>
                        <p className='text-sm leading-relaxed text-foreground/90'>
                          &ldquo;{review.comment || 'Excellent and compassionate care.'}&rdquo;
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='mt-6 rounded-2xl border border-border/60 bg-[#f8fafc] p-8 text-center'>
                    <Star className='mx-auto size-8 text-muted-foreground/50' />
                    <h3 className='mt-3 text-base font-bold text-foreground'>
                      No reviews submitted yet
                    </h3>
                    <p className='mt-1 text-xs text-muted-foreground'>
                      Be among the first patients to share feedback after your
                      visit with Dr. {doctor.name}.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Sticky Consultation Booking & Support Card */}
          <div className='sticky top-24 space-y-6'>
            <div className='rounded-[28px] border border-border/80 bg-[#f8fafc] p-6 shadow-xs sm:p-8 space-y-6'>
              <div>
                <span className='text-xs font-bold uppercase tracking-wider text-muted-foreground'>
                  Consultation Details
                </span>
                <div className='mt-2 flex items-baseline gap-2'>
                  <span className='text-3xl font-extrabold text-foreground'>
                    {doctor.appointmentFee ? `$${doctor.appointmentFee}` : 'Inquire'}
                  </span>
                  <span className='text-xs text-muted-foreground'>
                    / appointment
                  </span>
                </div>
                <p className='mt-1 text-xs text-muted-foreground'>
                  Includes complete medical evaluation and digital prescription.
                </p>
              </div>

              {/* Guarantees */}
              <div className='space-y-2.5 border-y border-border/60 py-4 text-xs font-medium text-foreground/90'>
                <div className='flex items-center gap-2'>
                  <CheckCircle2 className='size-4 text-primary' />
                  <span>Verified Medical Board Specialist</span>
                </div>
                <div className='flex items-center gap-2'>
                  <CheckCircle2 className='size-4 text-primary' />
                  <span>Instant digital booking confirmation</span>
                </div>
                <div className='flex items-center gap-2'>
                  <CheckCircle2 className='size-4 text-primary' />
                  <span>Emergency hospital support on-site</span>
                </div>
              </div>

              {/* Booking Actions */}
              <div className='space-y-3'>
                <Link
                  href='/#contact'
                  className={buttonVariants({
                    className:
                      'h-12 w-full rounded-xl bg-primary text-sm font-bold text-white shadow-md shadow-primary/20 hover:bg-primary/90'
                  })}>
                  <Calendar className='mr-2 size-4' />
                  Book Appointment
                </Link>

                <a
                  href='tel:01010928888'
                  className='inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-card text-sm font-bold text-foreground transition-colors hover:border-primary/40 hover:text-primary'>
                  <Phone className='size-4 text-primary' />
                  Call Clinic Reception
                </a>
              </div>

              {/* Hospital Campus Help */}
              <div className='space-y-2 pt-2 text-xs text-muted-foreground'>
                <div className='flex items-start gap-2'>
                  <MapPin className='mt-0.5 size-3.5 shrink-0 text-primary' />
                  <span>100 Health Avenue, Central Medical District</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Clock className='size-3.5 shrink-0 text-primary' />
                  <span>Outpatient: Mon – Sat (8:00 AM – 9:00 PM)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorDetailsView
