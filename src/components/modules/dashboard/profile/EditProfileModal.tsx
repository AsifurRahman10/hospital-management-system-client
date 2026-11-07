/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import AppField from '@/components/shared/AppField'
import AppModal from '@/components/shared/AppModal'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { updateMyProfile } from '@/service/profile.service'
import { Gender } from '@/types/doctor.types'
import { IProfile } from '@/types/profile.types'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Camera, LoaderCircle, UserRoundPen } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

interface EditProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profile: IProfile | null
}

const getInitials = (name?: string) =>
  name
    ?.split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U'

export const EditProfileModal = ({
  open,
  onOpenChange,
  profile
}: EditProfileModalProps) => {
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const role = profile?.role?.toUpperCase() || ''
  const isDoctor = role === 'DOCTOR'

  const roleData = profile?.doctor || profile?.patient || profile?.admin

  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [selectedGender, setSelectedGender] = useState<string>('')

  const initialValues = {
    name: roleData?.name || profile?.name || '',
    contactNumber: roleData?.contactNumber || '',
    address:
      (roleData && 'address' in roleData ? (roleData.address as string) : '') ||
      '',
    gender:
      (profile?.doctor?.gender as string) ||
      (profile?.patient && 'gender' in profile.patient
        ? (profile.patient.gender as string)
        : '') ||
      '',
    // Doctor fields
    registrationNumber: profile?.doctor?.registrationNumber || '',
    experience:
      profile?.doctor?.experience != null
        ? String(profile.doctor.experience)
        : '',
    appointmentFee:
      profile?.doctor?.appointmentFee != null
        ? String(profile.doctor.appointmentFee)
        : '',
    qualifications: profile?.doctor?.qualifications || '',
    currentWorkplace: profile?.doctor?.currentWorkplace || '',
    designation: profile?.doctor?.designation || ''
  }

  useEffect(() => {
    if (profile && open) {
      const existingPhoto = roleData?.profilePhoto || profile.image || null
      setPhotoPreview(existingPhoto)
      setPhotoFile(null)
      setSelectedGender(initialValues.gender)
    }
  }, [profile, open])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      const previewUrl = URL.createObjectURL(file)
      setPhotoPreview(previewUrl)
    }
  }

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (formData: FormData) =>
      updateMyProfile(profile?.role || 'PATIENT', formData)
  })

  const form = useForm({
    defaultValues: initialValues,
    onSubmit: async ({ value }) => {
      if (!value.name.trim()) {
        toast.error('Full Name is required.')
        return
      }

      try {
        const formData = new FormData()

        // Attach profilePhoto file
        if (photoFile) {
          formData.append('profilePhoto', photoFile)
        }

        // Standard profile fields (including gender for all roles)
        formData.append('name', value.name.trim())
        if (value.contactNumber)
          formData.append('contactNumber', value.contactNumber.trim())
        if (value.address) formData.append('address', value.address.trim())
        if (selectedGender) formData.append('gender', selectedGender)

        // Doctor-specific fields
        if (isDoctor) {
          if (value.registrationNumber)
            formData.append(
              'registrationNumber',
              value.registrationNumber.trim()
            )
          if (value.experience)
            formData.append('experience', value.experience.trim())
          if (value.appointmentFee)
            formData.append('appointmentFee', value.appointmentFee.trim())
          if (value.qualifications)
            formData.append('qualifications', value.qualifications.trim())
          if (value.currentWorkplace)
            formData.append('currentWorkplace', value.currentWorkplace.trim())
          if (value.designation)
            formData.append('designation', value.designation.trim())
        }

        // Also append JSON 'data' payload for backends expecting req.body.data
        const dataPayload: Record<string, unknown> = {
          name: value.name.trim(),
          contactNumber: value.contactNumber?.trim() || undefined,
          address: value.address?.trim() || undefined,
          gender: selectedGender || undefined
        }

        if (isDoctor) {
          dataPayload.registrationNumber =
            value.registrationNumber?.trim() || undefined
          dataPayload.experience = value.experience
            ? Number(value.experience)
            : undefined
          dataPayload.appointmentFee = value.appointmentFee
            ? Number(value.appointmentFee)
            : undefined
          dataPayload.qualifications = value.qualifications?.trim() || undefined
          dataPayload.currentWorkplace =
            value.currentWorkplace?.trim() || undefined
          dataPayload.designation = value.designation?.trim() || undefined
        }

        formData.append('data', JSON.stringify(dataPayload))

        const res = (await mutateAsync(formData)) as {
          success?: boolean
          message?: string
        }

        if (res?.success === false) {
          toast.error(res.message || 'Failed to update profile.')
          return
        }

        toast.success(res?.message || 'Profile updated successfully.')
        await queryClient.invalidateQueries({ queryKey: ['my-profile'] })
        onOpenChange(false)
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Failed to update profile.'
        toast.error(message)
      }
    }
  })

  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      size='2xl'
      title='Edit Profile'
      description='Update your personal, contact, and professional details.'
      icon={<UserRoundPen className='size-5' />}
      footer={
        <div className='flex items-center justify-end gap-2.5'>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={isPending}>
            Cancel
          </Button>
          <Button
            type='button'
            disabled={isPending}
            onClick={() => form.handleSubmit()}>
            {isPending && <LoaderCircle className='mr-2 size-4 animate-spin' />}
            Save Changes
          </Button>
        </div>
      }>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className='space-y-5 pb-2'>
        {/* Photo Upload Section */}
        <div className='flex flex-col items-center gap-3 rounded-xl border border-dashed border-border/80 bg-muted/10 p-4 text-center sm:flex-row sm:text-left'>
          <div className='relative'>
            <Avatar className='size-20 border-2 border-primary/20 shadow-xs'>
              <AvatarImage
                src={photoPreview || undefined}
                alt={initialValues.name}
              />
              <AvatarFallback className='text-lg font-bold'>
                {getInitials(initialValues.name)}
              </AvatarFallback>
            </Avatar>
            <button
              type='button'
              onClick={() => fileInputRef.current?.click()}
              className='absolute bottom-0 right-0 rounded-full bg-primary p-1.5 text-primary-foreground shadow-sm hover:bg-primary/90'
              title='Change photo'>
              <Camera className='size-3.5' />
            </button>
          </div>
          <div className='space-y-1 text-sm'>
            <p className='font-medium text-foreground'>Profile Photo</p>
            <p className='text-xs text-muted-foreground'>
              JPG, PNG, or WebP. Max 5MB.
            </p>
            <Button
              type='button'
              variant='outline'
              size='sm'
              className='h-7 text-xs'
              onClick={() => fileInputRef.current?.click()}>
              Upload New Image
            </Button>
            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              className='hidden'
              onChange={handlePhotoChange}
            />
          </div>
        </div>

        {/* Basic Fields */}
        <div className='grid gap-4 sm:grid-cols-2'>
          <form.Field
            name='name'
            validators={{
              onChange: ({ value }) =>
                !value.trim() ? 'Full Name is required' : undefined
            }}>
            {(field) => (
              <AppField
                field={field}
                label='Full Name'
                placeholder='Your full name'
                disabled={isPending}
              />
            )}
          </form.Field>

          <form.Field name='contactNumber'>
            {(field) => (
              <AppField
                field={field}
                label='Contact Number'
                placeholder='+1 234 567 890'
                disabled={isPending}
              />
            )}
          </form.Field>

          <form.Field name='address'>
            {(field) => (
              <AppField
                field={field}
                label='Address'
                placeholder='Your street address, city, country'
                disabled={isPending}
              />
            )}
          </form.Field>

          {/* Gender selection for all user roles */}
          <div className='space-y-1.5 flex gap-4'>
            <Label
              htmlFor='profile-gender'
              className='text-xs font-medium text-muted-foreground'>
              Gender
            </Label>
            <Select
              value={selectedGender}
              onValueChange={(val) => setSelectedGender(val || '')}
              disabled={isPending}>
              <SelectTrigger
                id='profile-gender'
                className='py-5 rounded-sm w-full'>
                <SelectValue placeholder='Select gender' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Gender.MALE}>Male</SelectItem>
                <SelectItem value={Gender.FEMALE}>Female</SelectItem>
                <SelectItem value={Gender.OTHER}>Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Doctor-Specific Fields */}
        {isDoctor && (
          <div className='space-y-4 rounded-xl border bg-muted/15 p-4'>
            <p className='text-xs font-bold uppercase tracking-wider text-primary'>
              Doctor Professional Information
            </p>
            <div className='grid gap-4 sm:grid-cols-2'>
              <form.Field name='designation'>
                {(field) => (
                  <AppField
                    field={field}
                    label='Designation'
                    placeholder='e.g. Senior Consultant'
                    disabled={isPending}
                  />
                )}
              </form.Field>

              <form.Field name='currentWorkplace'>
                {(field) => (
                  <AppField
                    field={field}
                    label='Current Workplace'
                    placeholder='e.g. Central Hospital, Dhaka'
                    disabled={isPending}
                  />
                )}
              </form.Field>

              <form.Field name='qualifications'>
                {(field) => (
                  <AppField
                    field={field}
                    label='Qualifications'
                    placeholder='e.g. MBBS, FCPS, MD'
                    disabled={isPending}
                  />
                )}
              </form.Field>

              <form.Field name='registrationNumber'>
                {(field) => (
                  <AppField
                    field={field}
                    label='Registration Number'
                    placeholder='e.g. 407'
                    disabled={isPending}
                  />
                )}
              </form.Field>

              <form.Field name='experience'>
                {(field) => (
                  <AppField
                    field={field}
                    label='Experience (Years)'
                    type='number'
                    placeholder='e.g. 5'
                    disabled={isPending}
                  />
                )}
              </form.Field>

              <form.Field name='appointmentFee'>
                {(field) => (
                  <AppField
                    field={field}
                    label='Appointment Fee ($)'
                    type='number'
                    placeholder='e.g. 50.00'
                    disabled={isPending}
                  />
                )}
              </form.Field>
            </div>
          </div>
        )}
      </form>
    </AppModal>
  )
}

export default EditProfileModal
