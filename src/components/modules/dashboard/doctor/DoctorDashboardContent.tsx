'use client'

import DashboardHeader, {
  DashboardHeaderUser
} from '@/components/modules/dashboard/DashboardHeader'
import AppointmentPieChart from '@/components/modules/dashboard/PieChart'
import { MetricCard } from '@/components/shared/MetricCard'
import { getStats } from '@/service/dashboard.service'
import { DoctorDashboardStats } from '@/types/dashboard.type'
import { useQuery } from '@tanstack/react-query'
import {
  CalendarDaysIcon,
  DollarSignIcon,
  PlusIcon,
  StarIcon,
  UsersIcon
} from 'lucide-react'
import Link from 'next/link'

interface DoctorDashboardContentProps {
  user?: DashboardHeaderUser | null
}

const DoctorDashboardContent = ({ user }: DoctorDashboardContentProps) => {
  const { data: doctorDashboardData } = useQuery({
    queryKey: ['doctor-dashboard-data'],
    queryFn: getStats,
    refetchOnWindowFocus: 'always'
  })

  const doctorData = doctorDashboardData as DoctorDashboardStats

  return (
    <div className='min-h-full bg-background px-4 py-6 md:px-8 md:py-8'>
      <div className='mx-auto flex w-full max-w-[1480px] flex-col gap-7'>
        <DashboardHeader
          user={user}
          action={
            <Link
              href='/doctor/dashboard/appointments'
              className='inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5'>
              <PlusIcon className='size-4' />
              View appointments
            </Link>
          }
        />

        {/* Metric Cards matching DoctorDashboardStats types */}
        <section className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
          <MetricCard
            label='Total Appointments'
            value={doctorData?.appointmentCount?.toString() ?? '0'}
            detail={`${doctorData?.appointmentCount || 0} scheduled consultations`}
            icon={<CalendarDaysIcon />}
            tone='mint'
          />
          <MetricCard
            label='Patients'
            value={doctorData?.patientCount?.toString() ?? '0'}
            detail='Total patients consulted'
            icon={<UsersIcon />}
            tone='blue'
          />
          <MetricCard
            label='Patient Reviews'
            value={doctorData?.reviewCount?.toString() ?? '0'}
            detail='Total feedback received'
            icon={<StarIcon />}
            tone='amber'
          />
          <MetricCard
            label='Total Revenue'
            value={
              doctorData?.totalRevenue != null
                ? `$${doctorData.totalRevenue.toFixed(2)}`
                : '$0.00'
            }
            detail='Earnings from completed care'
            icon={<DollarSignIcon />}
            tone='rose'
          />
        </section>

        {/* Charts matching DoctorDashboardStats types */}
        <section className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          <AppointmentPieChart
            data={doctorData?.appointmentStatusDistribution || []}
          />
        </section>
      </div>
    </div>
  )
}

export default DoctorDashboardContent
