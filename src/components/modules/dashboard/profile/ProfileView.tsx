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
import { ChangePasswordModal } from '@/components/modules/dashboard/profile/ChangePasswordModal'
import { EditProfileModal } from '@/components/modules/dashboard/profile/EditProfileModal'
import { getAllSpecialties } from '@/service/doctor.service'
import { getMe } from '@/service/profile.service'
import { IProfile } from '@/types/profile.types'
import { ISpecialty } from '@/types/specialty.types'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import {
  Award,
  Briefcase,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Coins,
  DollarSign,
  GraduationCap,
  KeyRound,
  Lock,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Shield,
  ShieldCheck,
  SlidersHorizontal,
  Stethoscope,
  User,
  UserCheck
} from 'lucide-react'
import { useMemo, useState } from 'react'

interface ProfileViewProps {
  initialProfile?: IProfile
}

const formatDateTime = (value?: string | Date | null) => {
  if (!value) return 'N/A'
  const dateValue = new Date(value)
  return Number.isNaN(dateValue.getTime())
    ? 'N/A'
    : format(dateValue, 'MMM dd, yyyy · hh:mm a')
}

const getInitials = (name?: string) =>
  name
    ?.split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U'

const DetailItem = ({
  icon: Icon,
  label,
  value
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: React.ReactNode
}) => (
  <div className='flex items-start gap-3'>
    <div className='mt-0.5 rounded-lg bg-primary/10 p-2 text-primary'>
      <Icon className='size-4' />
    </div>
    <div className='min-w-0 flex-1'>
      <p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
        {label}
      </p>
      <div className='mt-1 wrap-break-word text-sm font-medium text-foreground'>
        {value || 'N/A'}
      </div>
    </div>
  </div>
)

export const ProfileView = ({ initialProfile }: ProfileViewProps) => {
  const [activeTab, setActiveTab] = useState<
    'profile' | 'security' | 'account'
  >('profile')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)

  const { data: profileResponse, isLoading } = useQuery({
    queryKey: ['my-profile'],
    queryFn: getMe,
    initialData: initialProfile
      ? {
          success: true,
          message: 'Profile fetched',
          data: initialProfile
        }
      : undefined
  })

  const { data: specialtiesResponse } = useQuery({
    queryKey: ['specialties'],
    queryFn: getAllSpecialties,
    staleTime: 1000 * 60 * 60 * 6
  })

  const allSpecialties = useMemo<ISpecialty[]>(() => {
    return (
      (specialtiesResponse as unknown as { data?: ISpecialty[] })?.data ?? []
    )
  }, [specialtiesResponse])

  const profile = (profileResponse?.data as IProfile) ?? initialProfile

  const role = profile?.role?.toUpperCase() || 'USER'
  const isDoctor = role === 'DOCTOR'
  const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN'
  const isPatient = role === 'PATIENT'

  const doctor = profile?.doctor
  const patient = profile?.patient
  const admin = profile?.admin
  const roleData = doctor || patient || admin

  const displayName = roleData?.name || profile?.name || 'User Profile'
  const profilePhoto = roleData?.profilePhoto || profile?.image || undefined

  // Compute specialties list for doctor
  const doctorSpecialtiesList = useMemo(() => {
    if (!doctor?.doctorSpecialties?.length) return []
    return doctor.doctorSpecialties.map((item) => {
      if (item.specialty?.title) return item.specialty.title
      const found = allSpecialties.find((s) => s.id === item.specialtyId)
      return found?.title || 'Specialty'
    })
  }, [doctor, allSpecialties])

  const subtitleInfo = useMemo(() => {
    if (isDoctor) {
      const spec = doctorSpecialtiesList[0] || doctor?.designation || 'Doctor'
      const reg = doctor?.registrationNumber
        ? ` · Reg. No: ${doctor.registrationNumber}`
        : ''
      return `${spec}${reg}`
    }
    if (isAdmin) {
      return 'Hospital Administrator'
    }
    if (isPatient) {
      return 'Registered Patient'
    }
    return role
  }, [isDoctor, isAdmin, isPatient, doctorSpecialtiesList, doctor, role])

  if (isLoading && !profile) {
    return (
      <section className='mx-auto w-full max-w-6xl space-y-5 px-4 py-6 md:px-8'>
        <div className='animate-pulse space-y-5'>
          <div className='h-8 w-44 rounded bg-muted' />
          <div className='h-48 rounded-2xl bg-muted' />
          <div className='grid gap-5 lg:grid-cols-3'>
            <div className='h-72 rounded-xl bg-muted lg:col-span-2' />
            <div className='h-72 rounded-xl bg-muted' />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className='mx-auto w-full max-w-6xl space-y-6 px-4 py-5 md:px-8 md:py-7'>
      {/* Page Title */}
      <div>
        <h1 className='text-2xl font-extrabold tracking-tight text-foreground md:text-3xl'>
          My Profile
        </h1>
        <p className='mt-1 text-sm text-muted-foreground'>
          View and manage your profile, professional details and account
          settings.
        </p>
      </div>

      {/* Hero Banner Card */}
      <div className='overflow-hidden rounded-2xl border border-border bg-card shadow-xs'>
        <div className='h-28 bg-linear-to-r from-blue-100/90 via-blue-50/50 to-indigo-50/40 dark:from-blue-950/40 dark:via-background dark:to-background md:h-36' />
        <div className='px-5 pb-6 md:px-8'>
          <div className='-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between'>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-end'>
              <Avatar className='size-24 border-4 border-card shadow-md md:size-28'>
                <AvatarImage
                  src={profilePhoto}
                  alt={displayName}
                />
                <AvatarFallback className='text-xl font-bold'>
                  {getInitials(displayName)}
                </AvatarFallback>
              </Avatar>
              <div className='pb-1'>
                <div className='mb-1.5 flex items-center gap-2'>
                  <Badge className='bg-primary px-2.5 py-0.5 text-xs font-semibold capitalize text-primary-foreground'>
                    {role.toLowerCase().replace('_', ' ')}
                  </Badge>
                  {profile?.emailVerified && (
                    <Badge
                      variant='secondary'
                      className='text-xs'>
                      <CheckCircle2 className='mr-1 size-3 text-emerald-600' />
                      Verified
                    </Badge>
                  )}
                </div>
                <h2 className='text-xl font-extrabold tracking-tight text-foreground md:text-2xl'>
                  {isDoctor && !displayName.startsWith('Dr.')
                    ? `Dr. ${displayName}`
                    : displayName}
                </h2>
                <p className='mt-0.5 text-xs text-muted-foreground md:text-sm'>
                  {subtitleInfo}
                </p>
              </div>
            </div>

            <Button
              variant='outline'
              className='gap-2 shadow-xs'
              onClick={() => setIsEditModalOpen(true)}>
              <Pencil className='size-3.5' />
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className='flex items-center gap-6 border-b border-border text-sm font-medium'>
        <button
          type='button'
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 pb-3 transition-colors ${
            activeTab === 'profile'
              ? 'border-b-2 border-primary text-primary font-semibold'
              : 'text-muted-foreground hover:text-foreground'
          }`}>
          <User className='size-4' />
          Profile Information
        </button>

        <button
          type='button'
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 pb-3 transition-colors ${
            activeTab === 'security'
              ? 'border-b-2 border-primary text-primary font-semibold'
              : 'text-muted-foreground hover:text-foreground'
          }`}>
          <Shield className='size-4' />
          Security
        </button>

        <button
          type='button'
          onClick={() => setActiveTab('account')}
          className={`flex items-center gap-2 pb-3 transition-colors ${
            activeTab === 'account'
              ? 'border-b-2 border-primary text-primary font-semibold'
              : 'text-muted-foreground hover:text-foreground'
          }`}>
          <SlidersHorizontal className='size-4' />
          Account
        </button>
      </div>

      {/* Tab: Profile Information */}
      {activeTab === 'profile' && (
        <div className='grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)]'>
          {/* Left Column */}
          <div className='space-y-6'>
            {/* Personal Information */}
            <Card className='shadow-xs'>
              <CardHeader>
                <CardTitle className='text-base font-bold'>
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Your basic personal and contact information.
                </CardDescription>
              </CardHeader>
              <CardContent className='grid gap-5 sm:grid-cols-2'>
                <DetailItem
                  icon={Mail}
                  label='Email'
                  value={roleData?.email || profile?.email}
                />
                <DetailItem
                  icon={Phone}
                  label='Phone Number'
                  value={roleData?.contactNumber || 'N/A'}
                />
                <DetailItem
                  icon={User}
                  label='Gender'
                  value={
                    doctor?.gender ||
                    (patient && 'gender' in patient
                      ? (patient.gender as string)
                      : 'N/A') ||
                    'N/A'
                  }
                />
                <DetailItem
                  icon={MapPin}
                  label='Address'
                  value={
                    doctor?.address ||
                    (patient && 'address' in patient
                      ? (patient.address as string)
                      : 'N/A') ||
                    'N/A'
                  }
                />
              </CardContent>
            </Card>

            {/* Professional Information for Doctors */}
            {isDoctor && (
              <Card className='shadow-xs'>
                <CardHeader>
                  <CardTitle className='text-base font-bold'>
                    Professional Information
                  </CardTitle>
                  <CardDescription>
                    Your medical and professional details.
                  </CardDescription>
                </CardHeader>
                <CardContent className='grid gap-5 sm:grid-cols-2'>
                  <DetailItem
                    icon={GraduationCap}
                    label='Qualification'
                    value={doctor?.qualifications || 'N/A'}
                  />
                  <DetailItem
                    icon={Stethoscope}
                    label='Specialties'
                    value={
                      doctorSpecialtiesList.length ? (
                        <div className='flex flex-wrap gap-1.5'>
                          {doctorSpecialtiesList.map((spec, i) => (
                            <Badge
                              key={i}
                              variant='secondary'
                              className='text-xs font-normal'>
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        'No specialties added'
                      )
                    }
                  />
                  <DetailItem
                    icon={Award}
                    label='Registration Number'
                    value={doctor?.registrationNumber || 'N/A'}
                  />
                  <DetailItem
                    icon={Coins}
                    label='Appointment Fee'
                    value={
                      doctor?.appointmentFee != null
                        ? `$${doctor.appointmentFee.toFixed(2)}`
                        : 'N/A'
                    }
                  />
                  <DetailItem
                    icon={Briefcase}
                    label='Experience'
                    value={
                      doctor?.experience != null
                        ? `${doctor.experience} years`
                        : 'N/A'
                    }
                  />
                  <DetailItem
                    icon={Building2}
                    label='Current Workplace'
                    value={doctor?.currentWorkplace || 'N/A'}
                  />
                </CardContent>
              </Card>
            )}

            {/* Non-doctor role overview */}
            {!isDoctor && (
              <Card className='shadow-xs'>
                <CardHeader>
                  <CardTitle className='text-base font-bold'>
                    {isAdmin ? 'Administrative Privileges' : 'Patient Overview'}
                  </CardTitle>
                  <CardDescription>
                    {isAdmin
                      ? 'System access role and permissions overview.'
                      : 'Health profile and medical records summary.'}
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-3'>
                  <div className='rounded-xl border bg-muted/20 p-4 text-sm'>
                    <p className='font-semibold text-foreground'>
                      {isAdmin
                        ? 'Hospital Management Access'
                        : 'Patient Profile'}
                    </p>
                    <p className='mt-1 text-xs text-muted-foreground'>
                      {isAdmin
                        ? 'You have full access to manage doctors, schedules, specialties, appointments, and dashboard analytics.'
                        : 'You can view appointments, manage prescriptions, and review healthcare consultations.'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column */}
          <div className='space-y-6'>
            {/* Top Stat Banner */}
            <div className='rounded-xl bg-primary p-5 text-primary-foreground shadow-xs'>
              <div className='grid grid-cols-2 divide-x divide-primary-foreground/20'>
                <div className='pr-4'>
                  <p className='text-xs font-medium text-primary-foreground/80'>
                    {isDoctor ? 'Appointment Fee' : 'Account Role'}
                  </p>
                  <p className='mt-1.5 text-2xl font-black'>
                    {isDoctor
                      ? doctor?.appointmentFee != null
                        ? `$${doctor.appointmentFee.toFixed(2)}`
                        : '$0.00'
                      : role.replace('_', ' ')}
                  </p>
                </div>
                {isDoctor && (
                  <div className='pl-4'>
                    <p className='text-xs font-medium text-primary-foreground/80'>
                      Total Appointments
                    </p>
                    <p className='mt-1.5 text-2xl font-black'>
                      {doctor?._count?.appointments ??
                        patient?._count?.appointments ??
                        0}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Account Information Card */}
            <Card className='shadow-xs'>
              <CardHeader>
                <CardTitle className='text-base font-bold'>
                  Account Information
                </CardTitle>
                <CardDescription>
                  Your account status and activity details.
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='rounded-lg bg-primary/10 p-2 text-primary'>
                      <ShieldCheck className='size-4' />
                    </div>
                    <span className='text-sm font-medium'>Account Status</span>
                  </div>
                  <Badge
                    variant='outline'
                    className='bg-emerald-50 text-emerald-700 hover:bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400'>
                    {profile?.status || 'Active'}
                  </Badge>
                </div>

                <DetailItem
                  icon={CalendarDays}
                  label='Joined'
                  value={formatDateTime(profile?.createdAt)}
                />

                <DetailItem
                  icon={Clock3}
                  label='Last Updated'
                  value={formatDateTime(profile?.updatedAt)}
                />
              </CardContent>
            </Card>

            {/* Security Quick Card */}
            <Card className='shadow-xs'>
              <CardHeader>
                <CardTitle className='text-base font-bold'>Security</CardTitle>
                <CardDescription>
                  Manage your password and keep your account secure.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex items-center justify-between gap-3 rounded-xl border bg-muted/20 p-4'>
                  <div className='flex items-center gap-3'>
                    <div className='rounded-lg bg-primary/10 p-2 text-primary'>
                      <Lock className='size-4' />
                    </div>
                    <div>
                      <p className='text-sm font-semibold text-foreground'>
                        Password
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        {profile?.needPasswordChange
                          ? 'Password change required'
                          : 'Change your account password'}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setIsChangePasswordOpen(true)}>
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Tab: Security */}
      {activeTab === 'security' && (
        <div className='max-w-2xl space-y-6'>
          <Card className='shadow-xs'>
            <CardHeader>
              <CardTitle className='text-base font-bold'>
                Password & Authentication
              </CardTitle>
              <CardDescription>
                Manage your credentials and password security.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='rounded-lg bg-primary/10 p-2.5 text-primary'>
                    <KeyRound className='size-5' />
                  </div>
                  <div>
                    <p className='text-sm font-semibold text-foreground'>
                      Account Password
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      Update your account password regularly to stay protected.
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => setIsChangePasswordOpen(true)}
                  className='shrink-0'>
                  Change Password
                </Button>
              </div>

              <div className='flex items-center justify-between rounded-xl border p-4'>
                <div className='flex items-center gap-3'>
                  <div className='rounded-lg bg-primary/10 p-2.5 text-primary'>
                    <ShieldCheck className='size-5' />
                  </div>
                  <div>
                    <p className='text-sm font-semibold text-foreground'>
                      Email Verification Status
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      {profile?.emailVerified
                        ? 'Your email address is verified.'
                        : 'Your email address is pending verification.'}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={profile?.emailVerified ? 'secondary' : 'outline'}>
                  {profile?.emailVerified ? 'Verified' : 'Unverified'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab: Account */}
      {activeTab === 'account' && (
        <div className='max-w-2xl space-y-6'>
          <Card className='shadow-xs'>
            <CardHeader>
              <CardTitle className='text-base font-bold'>
                Account Overview
              </CardTitle>
              <CardDescription>
                Detailed overview of your registered system account.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {/* <DetailItem
                icon={UserCheck}
                label='User ID'
                value={
                  <span className='font-mono text-xs text-muted-foreground'>
                    {profile?.id}
                  </span>
                }
              /> */}
              <DetailItem
                icon={Shield}
                label='Role'
                value={
                  <Badge
                    variant='outline'
                    className='capitalize'>
                    {role.toLowerCase().replace('_', ' ')}
                  </Badge>
                }
              />
              <DetailItem
                icon={ShieldCheck}
                label='Account Status'
                value={
                  <Badge
                    variant='outline'
                    className='bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'>
                    {profile?.status || 'Active'}
                  </Badge>
                }
              />
              <DetailItem
                icon={CalendarDays}
                label='Registration Date'
                value={formatDateTime(profile?.createdAt)}
              />
              <DetailItem
                icon={Clock3}
                label='Last Profile Update'
                value={formatDateTime(profile?.updatedAt)}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Profile Modal */}
      <EditProfileModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        profile={profile || null}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        open={isChangePasswordOpen}
        onOpenChange={setIsChangePasswordOpen}
        userEmail={roleData?.email || profile?.email}
      />
    </section>
  )
}

export default ProfileView
