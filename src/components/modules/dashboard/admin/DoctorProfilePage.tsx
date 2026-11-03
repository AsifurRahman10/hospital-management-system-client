'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { getDoctorById } from '@/service/doctor.service'
import { IDoctorDetails } from '@/types/doctor.types'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  DollarSign,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
  Stethoscope
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ViewDoctorProfilePageProps {
  doctorId: string
}

const formatDateTime = (value?: string | Date | null) => {
  if (!value) return 'N/A'
  const dateValue = new Date(value)
  return Number.isNaN(dateValue.getTime())
    ? 'N/A'
    : format(dateValue, 'MMM dd, yyyy · hh:mm a')
}

const getAverageRating = (reviews: IDoctorDetails['reviews']) => {
  if (!reviews?.length) return 0
  return (
    reviews.reduce((sum, review) => sum + (review.rating ?? 0), 0) /
    reviews.length
  )
}

const getInitials = (name?: string) =>
  name
    ?.split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'DR'

const DetailItem = ({
  icon: Icon,
  label,
  value
}: {
  icon: typeof Mail
  label: string
  value: string
}) => (
  <div className='flex items-start gap-3'>
    <div className='mt-0.5 rounded-lg bg-primary/10 p-2 text-primary'>
      <Icon className='size-4' />
    </div>
    <div className='min-w-0'>
      <p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
        {label}
      </p>
      <p className='mt-1 wrap-break-word text-sm font-medium text-foreground'>
        {value}
      </p>
    </div>
  </div>
)

const ViewDoctorProfilePage = ({ doctorId }: ViewDoctorProfilePageProps) => {
  const router = useRouter()
  const { data, isLoading, isError } = useQuery({
    queryKey: ['doctor-details', doctorId],
    queryFn: () => getDoctorById(doctorId),
    enabled: doctorId.length > 0
  })

  const doctorDetails = data?.success ? data.data : null
  const errorMessage = data && !data.success ? data.message : undefined
  const averageRating = getAverageRating(doctorDetails?.reviews)

  if (isLoading) {
    return (
      <section className='mx-auto w-full max-w-350 px-4 py-6 md:px-8'>
        <div className='animate-pulse space-y-5'>
          <div className='h-8 w-40 rounded bg-muted' />
          <div className='h-64 rounded-2xl bg-muted' />
          <div className='grid gap-5 lg:grid-cols-3'>
            <div className='h-72 rounded-xl bg-muted lg:col-span-2' />
            <div className='h-72 rounded-xl bg-muted' />
          </div>
        </div>
      </section>
    )
  }

  if (isError || !doctorDetails) {
    return (
      <section className='mx-auto flex w-full max-w-350 flex-col items-start gap-4 px-4 py-10 md:px-8'>
        <Button
          variant='ghost'
          onClick={() => router.back()}>
          <ArrowLeft /> Back to doctors
        </Button>
        <div className='w-full rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive'>
          {errorMessage || 'Failed to load doctor details.'}
        </div>
      </section>
    )
  }

  return (
    <section className='mx-auto w-full max-w-350 space-y-5 px-4 py-5 md:px-8 md:py-7'>
      <Button
        variant='ghost'
        className='-ml-2 text-muted-foreground'
        onClick={() => router.back()}>
        <ArrowLeft /> Back to doctors
      </Button>

      <div className='overflow-hidden rounded-2xl border border-border bg-card shadow-sm'>
        <div className='h-28 bg-linear-to-r from-primary/20 via-primary/5 to-transparent md:h-36' />
        <div className='px-5 pb-6 md:px-8'>
          <div className='-mt-14 flex flex-col gap-5 md:-mt-16 md:flex-row md:items-end md:justify-between'>
            <div className='flex flex-col gap-4 md:flex-row md:items-end'>
              <Avatar className='size-28 border-4 border-card shadow-md md:size-32'>
                <AvatarImage
                  src={doctorDetails.profilePhoto || undefined}
                  alt={doctorDetails.name}
                />
                <AvatarFallback className='text-2xl'>
                  {getInitials(doctorDetails.name)}
                </AvatarFallback>
              </Avatar>
              <div className='pb-1'>
                <div className='mb-2 flex flex-wrap items-center gap-2'>
                  <Badge variant='default'>
                    {doctorDetails.user.status.toLowerCase()}
                  </Badge>
                  {doctorDetails.user.emailVerified && (
                    <Badge variant='secondary'>
                      <CheckCircle2 /> Verified account
                    </Badge>
                  )}
                </div>
                <h1 className='text-2xl font-extrabold tracking-tight md:text-3xl'>
                  {doctorDetails.name}
                </h1>
                <p className='mt-1 text-sm text-muted-foreground'>
                  {doctorDetails.designation || 'Medical professional'} ·{' '}
                  {doctorDetails.currentWorkplace || 'Workplace not listed'}
                </p>
              </div>
            </div>
            <div className='flex items-center gap-2 rounded-xl border bg-background px-4 py-3'>
              <Star className='size-5 fill-yellow-400 text-yellow-400' />
              <div>
                <p className='text-lg font-bold'>{averageRating.toFixed(1)}</p>
                <p className='text-xs text-muted-foreground'>
                  {doctorDetails.reviews?.length ?? 0} patient reviews
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(300px,1fr)]'>
        <div className='space-y-5'>
          <Card>
            <CardHeader>
              <CardTitle>Professional overview</CardTitle>
              <CardDescription>
                Credentials and contact information for this practitioner.
              </CardDescription>
            </CardHeader>
            <CardContent className='grid gap-5 sm:grid-cols-2'>
              <DetailItem
                icon={Mail}
                label='Email'
                value={doctorDetails.email}
              />
              <DetailItem
                icon={Phone}
                label='Contact number'
                value={doctorDetails.contactNumber || 'N/A'}
              />
              <DetailItem
                icon={Stethoscope}
                label='Qualification'
                value={doctorDetails.qualifications || 'N/A'}
              />
              <DetailItem
                icon={BriefcaseBusiness}
                label='Experience'
                value={`${doctorDetails.experience ?? 0} years`}
              />
              <DetailItem
                icon={ShieldCheck}
                label='Registration number'
                value={doctorDetails.registrationNumber || 'N/A'}
              />
              <DetailItem
                icon={MapPin}
                label='Address'
                value={doctorDetails.address || 'N/A'}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Specialties</CardTitle>
              <CardDescription>Areas of clinical expertise.</CardDescription>
            </CardHeader>
            <CardContent className='flex flex-wrap gap-2'>
              {doctorDetails.doctorSpecialties?.length ? (
                doctorDetails.doctorSpecialties.map((item) => (
                  <Badge
                    key={item.specialty.id}
                    variant='secondary'>
                    {item.specialty.title}
                  </Badge>
                ))
              ) : (
                <p className='text-sm text-muted-foreground'>
                  No specialties available.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent patient feedback</CardTitle>
              <CardDescription>
                The latest reviews shared by patients.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-3'>
              {doctorDetails.reviews?.length ? (
                doctorDetails.reviews.slice(0, 5).map((review, index) => (
                  <div
                    key={review.id ?? `review-${index}`}
                    className='rounded-xl border bg-muted/20 p-4'>
                    <div className='flex items-center justify-between gap-3'>
                      <div className='flex items-center gap-1'>
                        <Star className='size-4 fill-yellow-400 text-yellow-400' />
                        <span className='text-sm font-semibold'>
                          {review.rating ?? 'N/A'}
                        </span>
                      </div>
                      <span className='text-xs text-muted-foreground'>
                        {formatDateTime(review.createdAt)}
                      </span>
                    </div>
                    <p className='mt-2 text-sm leading-6 text-muted-foreground'>
                      {review.comment || 'No comment provided.'}
                    </p>
                  </div>
                ))
              ) : (
                <p className='text-sm text-muted-foreground'>
                  No reviews available.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className='space-y-5'>
          <Card className='bg-primary text-primary-foreground'>
            <CardContent className='grid grid-cols-2 gap-4 pt-6'>
              <div>
                <p className='text-xs text-primary-foreground/70'>
                  Appointment fee
                </p>
                <p className='mt-1 flex items-center text-2xl font-bold'>
                  <DollarSign className='size-5' />
                  {doctorDetails.appointmentFee?.toFixed(2) ?? 'N/A'}
                </p>
              </div>
              <div>
                <p className='text-xs text-primary-foreground/70'>
                  Appointments
                </p>
                <p className='mt-1 text-2xl font-bold'>
                  {doctorDetails.appointments?.length ?? 0}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account details</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <DetailItem
                icon={ShieldCheck}
                label='Account status'
                value={doctorDetails.user.status}
              />
              <DetailItem
                icon={CalendarDays}
                label='Joined'
                value={formatDateTime(doctorDetails.user.createdAt)}
              />
              <DetailItem
                icon={Clock3}
                label='Last updated'
                value={formatDateTime(doctorDetails.user.updatedAt)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming schedules</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              {doctorDetails.doctorSchedules?.length ? (
                doctorDetails.doctorSchedules.slice(0, 6).map((item, index) => (
                  <div
                    key={item.id ?? item.schedule?.id ?? `schedule-${index}`}
                    className='flex items-center justify-between gap-3 rounded-lg border p-3'>
                    <div>
                      <p className='text-sm font-semibold'>
                        {formatDateTime(item.schedule?.startDateTime)}
                      </p>
                      <p className='mt-1 text-xs text-muted-foreground'>
                        Ends {formatDateTime(item.schedule?.endDateTime)}
                      </p>
                    </div>
                    <Badge variant={item.isBooked ? 'secondary' : 'outline'}>
                      {item.isBooked ? 'Booked' : 'Available'}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className='text-sm text-muted-foreground'>
                  No schedules available.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent appointments</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              {doctorDetails.appointments?.length ? (
                doctorDetails.appointments
                  .slice(0, 5)
                  .map((appointment, index) => (
                    <div
                      key={appointment.id ?? `appointment-${index}`}
                      className='rounded-lg border p-3'>
                      <div className='flex items-center justify-between gap-3'>
                        <p className='text-sm font-semibold'>
                          {appointment.patient?.name || 'Unknown patient'}
                        </p>
                        <Badge variant='outline'>
                          {appointment.status || 'N/A'}
                        </Badge>
                      </div>
                      <p className='mt-1 text-xs text-muted-foreground'>
                        {formatDateTime(appointment.schedule?.startDateTime)}
                      </p>
                    </div>
                  ))
              ) : (
                <p className='text-sm text-muted-foreground'>
                  No appointments available.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default ViewDoctorProfilePage
