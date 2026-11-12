'use client'

import DashboardHeader, {
  DashboardHeaderUser
} from '@/components/modules/dashboard/DashboardHeader'
import AppointmentPieChart from '@/components/modules/dashboard/PieChart'
import { MetricCard } from '@/components/shared/MetricCard'
import { getStats } from '@/service/dashboard.service'
import { PatientDashboardStats } from '@/types/dashboard.type'
import { useQuery } from '@tanstack/react-query'
import { CalendarDaysIcon, PlusIcon, StarIcon } from 'lucide-react'
import Link from 'next/link'

interface PatientDashboardContentProps {
  user?: DashboardHeaderUser | null
}

const PatientDashboardContent = ({ user }: PatientDashboardContentProps) => {
  const { data: patientDashboardData } = useQuery({
    queryKey: ['patient-dashboard-data'],
    queryFn: getStats,
    refetchOnWindowFocus: 'always'
  })

  const patientData = patientDashboardData as PatientDashboardStats

  return (
    <div className='min-h-full bg-background px-4 py-6 md:px-8 md:py-8'>
      <div className='mx-auto flex w-full max-w-[1480px] flex-col gap-7'>
        <DashboardHeader
          user={user}
          action={
            <Link
              href='/doctors'
              className='inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5'>
              <PlusIcon className='size-4' />
              Book appointment
            </Link>
          }
        />

        {/* Metric Cards matching PatientDashboardStats types */}
        <section className='grid gap-4 sm:grid-cols-2'>
          <MetricCard
            label='Total Appointments'
            value={patientData?.appointmentCount?.toString() ?? '0'}
            detail={`${patientData?.appointmentCount || 0} scheduled consultations`}
            icon={<CalendarDaysIcon />}
            tone='mint'
          />
          <MetricCard
            label='Reviews Given'
            value={patientData?.reviewCount?.toString() ?? '0'}
            detail='Total feedback submitted'
            icon={<StarIcon />}
            tone='amber'
          />
        </section>

        {/* Charts matching PatientDashboardStats types */}
        <section className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          <AppointmentPieChart
            data={patientData?.appointmentStatusDistribution || []}
          />
        </section>
      </div>
    </div>
  )
}

export default PatientDashboardContent
