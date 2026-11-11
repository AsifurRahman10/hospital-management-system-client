'use client'

import { IDoctorDetails } from '@/types/doctor.types'
import { format } from 'date-fns'
import {
  ArrowLeft,
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
import { DoctorSchedulePicker } from './DoctorSchedulePicker'

export interface DoctorDetailsViewProps {
  doctor: IDoctorDetails
}

export const DoctorDetailsView = ({ doctor }: DoctorDetailsViewProps) => {
  const [rightTab, setRightTab] = useState<'about' | 'reviews'>('about')

  const hasValidImage = isValidDoctorImage(doctor.profilePhoto)
  const averageRating =
    doctor.reviews && doctor.reviews.length > 0
      ? doctor.reviews.reduce((sum, r) => sum + (r.rating ?? 0), 0) /
        doctor.reviews.length
      : (doctor.averageRating ?? 5.0)

  const reviews = doctor.reviews ?? []

  return (
    <div className='w-full pt-4'>
      <div className='container-custom space-y-8'>
        {/* Doctor Header Showcase Card */}
        <div className='overflow-hidden rounded-xl border border-border/80  shadow-xs'>
          <div className='flex flex-col md:flex-row'>
            {/* Left: Photo on primary background */}
            <div className='relative flex shrink-0 items-end justify-center '>
              {hasValidImage ? (
                <Image
                  src={doctor.profilePhoto!}
                  alt={doctor.name || 'Doctor'}
                  width={280}
                  height={320}
                  priority
                  className='relative z-10 w-auto object-cover md:max-h-80 '
                />
              ) : (
                <div className='relative z-10 flex size-52 items-center justify-center text-white/50 md:size-60'>
                  <User
                    className='size-24'
                    aria-hidden='true'
                  />
                </div>
              )}
            </div>

            {/* Right: Doctor Info */}
            <div className='flex flex-1 flex-col justify-center gap-5 p-6 sm:p-8 md:p-10'>
              {/* Name + Verified */}
              <div>
                <div className='flex flex-wrap items-center gap-2'>
                  <h1 className='text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl'>
                    {doctor.name}
                  </h1>
                  <ShieldCheck className='size-5 fill-primary text-white' />
                </div>

                {/* Qualification line + Experience pill */}
                <div className='mt-1.5 flex flex-wrap items-center gap-2.5'>
                  <p className='text-sm text-muted-foreground'>
                    {[doctor.qualifications, doctor.designation]
                      .filter(Boolean)
                      .join(' - ') || 'Specialist Physician'}
                  </p>
                  {typeof doctor.experience === 'number' && (
                    <span className='rounded-full border border-border bg-muted/60 px-2.5 py-0.5 text-xs font-semibold text-foreground'>
                      {doctor.experience} Years
                    </span>
                  )}
                </div>
              </div>

              {/* About section */}
              <div className='space-y-1.5'>
                <div className='flex items-center gap-1.5 text-sm font-bold text-foreground'>
                  About
                  <Stethoscope className='size-3.5 text-muted-foreground' />
                </div>
                <p className='text-sm leading-relaxed text-muted-foreground'>
                  {doctor.name} has a strong commitment to delivering
                  comprehensive medical care, focusing on preventive medicine,
                  early diagnosis, and effective treatment strategies.
                  {doctor.currentWorkplace &&
                    ` Currently practicing at ${doctor.currentWorkplace}.`}
                </p>
              </div>

              {/* Appointment Fee */}
              <p className='text-sm text-foreground'>
                <span className='font-bold'>Appointment fee:</span>{' '}
                <span className='font-extrabold text-primary'>
                  {doctor.appointmentFee
                    ? `$${doctor.appointmentFee}`
                    : 'Inquire'}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* 2-Column Content Layout: 2/3 Schedule Picker (Left) + 1/3 About & Reviews (Right) */}
        <div className='grid grid-cols-1 items-start gap-8 lg:grid-cols-3'>
          {/* 2/3 Column: Doctor Schedule Selection */}
          <div className='space-y-6 lg:col-span-2'>
            <DoctorSchedulePicker doctor={doctor} />
          </div>

          {/* 1/3 Column: About, Qualifications, and Reviews */}
          <div className='space-y-6 lg:col-span-1'>
            {/* Tab Navigation Controls */}
            <div className='flex items-center gap-1 rounded-xl border border-border/70 bg-card p-1 shadow-2xs'>
              <button
                type='button'
                onClick={() => setRightTab('about')}
                className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
                  rightTab === 'about'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}>
                About & Credentials
              </button>

              <button
                type='button'
                onClick={() => setRightTab('reviews')}
                className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
                  rightTab === 'reviews'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}>
                Reviews ({reviews.length})
              </button>
            </div>

            {/* Content Tab 1: About & Qualifications */}
            {rightTab === 'about' && (
              <div className='space-y-5 rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs'>
                <div>
                  <h3 className='text-sm font-bold uppercase tracking-wider text-foreground'>
                    Clinical Profile
                  </h3>
                  <p className='mt-2 text-xs leading-relaxed text-muted-foreground'>
                    {doctor.name} is a dedicated{' '}
                    {doctor.designation || 'Specialist Physician'} at{' '}
                    {doctor.currentWorkplace || 'Life Hospital'}. With{' '}
                    {doctor.experience ?? 5}+ years of clinical experience, Dr.{' '}
                    {doctor.name} specializes in advanced patient diagnostics,
                    preventative medicine, and specialized healthcare delivery.
                  </p>
                </div>

                {doctor.qualifications && (
                  <div className='border-t border-border/60 pt-4'>
                    <h4 className='flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-foreground'>
                      <GraduationCap className='size-3.5 text-primary' />
                      Qualifications & Degrees
                    </h4>
                    <p className='mt-1.5 text-xs text-muted-foreground'>
                      {doctor.qualifications}
                    </p>
                  </div>
                )}

                {doctor.doctorSpecialties &&
                  doctor.doctorSpecialties.length > 0 && (
                    <div className='border-t border-border/60 pt-4'>
                      <h4 className='flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-foreground'>
                        <Stethoscope className='size-3.5 text-primary' />
                        Specialties
                      </h4>
                      <div className='mt-2 flex flex-wrap gap-1.5'>
                        {doctor.doctorSpecialties.map((ds) => (
                          <span
                            key={ds.specialtyId || ds.specialty?.id}
                            className='rounded-lg border border-border bg-muted/40 px-2.5 py-1 text-[11px] font-semibold text-foreground'>
                            {ds.specialty?.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                <div className='border-t border-border/60 pt-4'>
                  <h4 className='flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-foreground'>
                    <MapPin className='size-3.5 text-primary' />
                    Department & Facility
                  </h4>
                  <p className='mt-1.5 text-xs text-muted-foreground'>
                    {doctor.address ||
                      '100 Health Avenue, Life Hospital Main Campus, Outpatient Facility'}
                  </p>
                </div>

                {/* Direct Reception Helpline */}
                <div className='border-t border-border/60 pt-4'>
                  <a
                    href='tel:01010928888'
                    className='flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-[#f8fafc] py-2.5 text-xs font-bold text-foreground transition-colors hover:border-primary/40 hover:text-primary'>
                    <Phone className='size-3.5 text-primary' />
                    <span>Call Reception: 010-1092-8888</span>
                  </a>
                </div>
              </div>
            )}

            {/* Content Tab 2: Reviews */}
            {rightTab === 'reviews' && (
              <div className='space-y-4 rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs'>
                <div className='flex items-center justify-between border-b border-border/60 pb-3'>
                  <div>
                    <h3 className='text-sm font-bold uppercase tracking-wider text-foreground'>
                      Patient Reviews
                    </h3>
                    <p className='text-xs text-muted-foreground'>
                      Verified clinical consultations
                    </p>
                  </div>
                  <div className='flex items-center gap-1 text-amber-500'>
                    <Star className='size-4 fill-amber-400' />
                    <span className='text-sm font-extrabold text-foreground'>
                      {averageRating.toFixed(1)}
                    </span>
                  </div>
                </div>

                {reviews.length > 0 ? (
                  <div className='max-h-[480px] space-y-3 overflow-y-auto pr-1'>
                    {reviews.map((review, idx) => (
                      <div
                        key={review.id || idx}
                        className='space-y-1.5 rounded-xl border border-border/60 bg-[#f8fafc] p-3'>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-0.5'>
                            {Array.from({ length: 5 }).map((_, s) => (
                              <Star
                                key={s}
                                className={`size-3 ${
                                  s < (review.rating ?? 5)
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-muted-foreground/30'
                                }`}
                              />
                            ))}
                          </div>
                          {review.createdAt && (
                            <span className='text-[10px] text-muted-foreground'>
                              {format(
                                new Date(review.createdAt),
                                'MMM dd, yyyy'
                              )}
                            </span>
                          )}
                        </div>
                        <p className='text-xs leading-relaxed text-foreground/90'>
                          &ldquo;
                          {review.comment || 'Excellent care and diagnosis.'}
                          &rdquo;
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='rounded-xl border border-dashed border-border/80 bg-muted/20 p-6 text-center'>
                    <Star className='mx-auto size-6 text-muted-foreground/50' />
                    <p className='mt-2 text-xs font-bold text-foreground'>
                      No reviews submitted yet
                    </p>
                    <p className='mt-1 text-[11px] text-muted-foreground'>
                      Be among the first patients to share feedback after your
                      visit with Dr. {doctor.name}.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorDetailsView
