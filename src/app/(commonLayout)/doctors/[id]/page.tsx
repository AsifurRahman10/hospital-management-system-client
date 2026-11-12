import DoctorDetailsView from '@/components/modules/storeFront/DoctorDetailsView'
import { getDoctorById } from '@/service/doctor.service'
import { notFound } from 'next/navigation'
import React from 'react'

interface DoctorPageProps {
  params: Promise<{ id: string }>
}

export default async function DoctorProfilePage({ params }: DoctorPageProps) {
  const { id } = await params

  if (!id) {
    notFound()
  }

  let doctorDetails = null

  try {
    const res = await getDoctorById(id)
    if (res?.data) {
      doctorDetails = res.data
    }
  } catch (error) {
    console.error(`Error loading doctor profile for ID ${id}:`, error)
  }

  if (!doctorDetails) {
    notFound()
  }

  return (
    <div className='min-h-screen bg-background font-sans text-foreground antialiased selection:bg-primary/10 selection:text-primary'>
      <main id='main-content'>
        <DoctorDetailsView doctor={doctorDetails} />
      </main>
    </div>
  )
}
