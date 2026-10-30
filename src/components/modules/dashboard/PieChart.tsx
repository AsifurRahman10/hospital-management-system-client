'use client'

import { Pie, PieChart } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from '@/components/ui/chart'

interface AppointmentPieChartProps {
  data: {
    status: string
    count: number
  }[]
}

const statusColors: Record<string, string> = {
  COMPLETED: 'var(--accent)',
  SCHEDULED: 'var(--primary)',
  CANCELED: 'var(--destructive)'
}

const chartConfig = {
  count: {
    label: 'Appointments'
  },
  COMPLETED: {
    label: 'Completed',
    color: statusColors.COMPLETED
  },
  SCHEDULED: {
    label: 'Scheduled',
    color: statusColors.SCHEDULED
  },
  CANCELED: {
    label: 'Canceled',
    color: statusColors.CANCELED
  }
} satisfies ChartConfig

const AppointmentPieChart = ({ data }: AppointmentPieChartProps) => {
  const chartData = data.map((item) => ({
    status: item.status,
    count: item.count,
    fill: statusColors[item.status] ?? 'var(--muted-foreground)'
  }))

  return (
    <Card className='flex flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>Appointments by Status</CardTitle>
        <CardDescription>Distribution of appointment statuses</CardDescription>
      </CardHeader>

      <CardContent className='flex-1'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto h-90 w-full max-w-140 [&_.recharts-pie-label-text]:fill-foreground'>
          <PieChart margin={{ top: 32, right: 88, bottom: 32, left: 88 }}>
            <ChartTooltip content={<ChartTooltipContent nameKey='status' />} />

            <Pie
              data={chartData}
              dataKey='count'
              nameKey='status'
              cx='50%'
              cy='50%'
              outerRadius='92%'
              label={({ name, value }) => `${name}: ${value}`}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default AppointmentPieChart
