'use client'

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
  ChartTooltipContent
} from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts'

interface AppointmentBarChartProps {
  data: {
    month: string
    count: number
  }[]
}

const chartConfig = {
  count: {
    label: 'Appointments',
    color: 'var(--primary)'
  },
  label: {
    color: 'var(--background)'
  }
}

const BarChartComponent = ({ data }: AppointmentBarChartProps) => {
  const formattedData = data.map((item) => ({
    month: new Date(item.month).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC'
    }),
    count: item.count
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appointments Overview</CardTitle>
        <CardDescription>Monthly appointment statistics</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={formattedData}>
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey='month'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />

            <Bar
              dataKey='count'
              fill='var(--color-count)'
              radius={8}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default BarChartComponent
