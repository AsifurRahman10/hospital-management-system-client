import { AttentionItem } from '@/components/shared/AttentionItem'
import { MetricCard } from '@/components/shared/MetricCard'
import {
  ArrowUpRightIcon,
  CalendarDaysIcon,
  ChevronRightIcon,
  Clock3Icon,
  MoreHorizontalIcon,
  PlusIcon,
  StethoscopeIcon,
  UsersIcon
} from 'lucide-react'

const appointments = [
  {
    time: '09:00',
    name: 'Olivia Bennett',
    type: 'Follow-up consultation',
    color: 'bg-primary'
  },
  {
    time: '10:30',
    name: 'Noah Williams',
    type: 'Annual health review',
    color: 'bg-accent'
  },
  {
    time: '13:15',
    name: 'Emma Richardson',
    type: 'Medication check-in',
    color: 'bg-[#f3b35b]'
  }
]

const activity = [42, 58, 49, 72, 64, 86, 78, 92, 83, 96, 88, 100]
const DoctorDashboardPage = () => {
  // const
  return (
    <div className='min-h-full bg-background px-4 py-6 md:px-8 md:py-8'>
      <div className='mx-auto flex w-full max-w-[1480px] flex-col gap-7'>
        <section className='flex flex-col justify-between gap-4 md:flex-row md:items-end'>
          <div>
            <p className='mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary'>
              Thursday, October 16, 2025
            </p>
            <h1 className='text-3xl font-extrabold tracking-tight text-foreground md:text-4xl'>
              Good morning, Dr. Chen
            </h1>
            <p className='mt-2 text-sm text-muted-foreground'>
              Here is what needs your attention today.
            </p>
          </div>
          <button
            className='inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5'
            type='button'>
            <PlusIcon className='size-4' />
            New appointment
          </button>
        </section>

        <section className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
          <MetricCard
            label='Patients today'
            value='24'
            detail='+12% vs last week'
            icon={<UsersIcon />}
            tone='blue'
          />
          <MetricCard
            label='Appointments'
            value='08'
            detail='3 still available'
            icon={<CalendarDaysIcon />}
            tone='mint'
          />
          <MetricCard
            label='Care completion'
            value='86%'
            detail='+8.4% this month'
            icon={<StethoscopeIcon />}
            tone='amber'
          />
          <MetricCard
            label='Unread messages'
            value='06'
            detail='2 need a reply'
            icon={<Clock3Icon />}
            tone='rose'
          />
        </section>

        <section className='grid gap-4 xl:grid-cols-[1.35fr_0.65fr]'>
          <div className='rounded-lg border border-border bg-card p-5 shadow-[0_8px_24px_rgba(27,45,75,0.04)] md:p-6'>
            <div className='mb-6 flex items-start justify-between'>
              <div>
                <h2 className='font-bold text-foreground'>Patient activity</h2>
                <p className='mt-1 text-xs text-muted-foreground'>
                  Patient interactions over the last 12 weeks
                </p>
              </div>
              <button
                className='inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground'
                type='button'>
                Last 12 weeks{' '}
                <ChevronRightIcon className='size-3.5 rotate-90' />
              </button>
            </div>
            <div className='flex h-48 items-end gap-2 border-b border-border/80 pb-0 sm:gap-3'>
              {activity.map((height, index) => (
                <div
                  className='group flex h-full flex-1 flex-col justify-end gap-2'
                  key={index}>
                  <div
                    className='relative w-full rounded-t-sm bg-secondary transition-colors group-hover:bg-primary/70'
                    style={{ height: `${height}%` }}>
                    <span className='absolute -top-6 left-1/2 hidden -translate-x-1/2 text-[10px] font-bold text-foreground group-hover:block'>
                      {height}
                    </span>
                  </div>
                  <span className='text-center text-[10px] text-muted-foreground'>
                    {
                      [
                        'Jun 30',
                        '',
                        'Jul 14',
                        '',
                        'Jul 28',
                        '',
                        'Aug 11',
                        '',
                        'Aug 25',
                        '',
                        'Sep 8',
                        ''
                      ][index]
                    }
                  </span>
                </div>
              ))}
            </div>
            <div className='mt-5 flex items-center gap-5 text-xs text-muted-foreground'>
              <span className='flex items-center gap-2'>
                <span className='size-2 rounded-full bg-primary' /> Total visits{' '}
                <strong className='text-foreground'>384</strong>
              </span>
              <span className='flex items-center gap-2'>
                <span className='size-2 rounded-full bg-accent' /> New patients{' '}
                <strong className='text-foreground'>68</strong>
              </span>
            </div>
          </div>

          <div className='rounded-lg border border-border bg-foreground p-5 text-white shadow-[0_8px_24px_rgba(27,45,75,0.08)] md:p-6'>
            <div className='flex items-start justify-between'>
              <div>
                <p className='text-xs font-semibold uppercase tracking-[0.14em] text-accent'>
                  Your focus
                </p>
                <h2 className='mt-2 text-xl font-bold'>
                  Care that keeps moving
                </h2>
              </div>
              <div className='grid size-9 place-items-center rounded-full bg-white/10'>
                <ArrowUpRightIcon className='size-4' />
              </div>
            </div>
            <p className='mt-8 max-w-[250px] text-sm leading-6 text-white/65'>
              You have completed 18% more care plans than this time last month.
            </p>
            <div className='mt-8 h-2 overflow-hidden rounded-full bg-white/10'>
              <div className='h-full w-[78%] rounded-full bg-accent' />
            </div>
            <div className='mt-2 flex justify-between text-xs text-white/55'>
              <span>Monthly goal</span>
              <span className='font-semibold text-white'>78%</span>
            </div>
          </div>
        </section>

        <section className='grid gap-4 xl:grid-cols-[1fr_0.85fr]'>
          <div className='rounded-lg border border-border bg-card p-5 shadow-[0_8px_24px_rgba(27,45,75,0.04)] md:p-6'>
            <div className='mb-5 flex items-center justify-between'>
              <div>
                <h2 className='font-bold'>Today&apos;s schedule</h2>
                <p className='mt-1 text-xs text-muted-foreground'>
                  Wednesday, 16 October
                </p>
              </div>
              <button
                className='text-muted-foreground hover:text-foreground'
                type='button'
                aria-label='More schedule options'>
                <MoreHorizontalIcon className='size-5' />
              </button>
            </div>
            <div className='space-y-1'>
              {appointments.map((appointment) => (
                <div
                  className='flex items-center gap-4 rounded-md px-2 py-3 transition-colors hover:bg-muted/60'
                  key={appointment.name}>
                  <span className='w-12 text-xs font-semibold text-muted-foreground'>
                    {appointment.time}
                  </span>
                  <span
                    className={`size-2.5 rounded-full ${appointment.color}`}
                  />
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-sm font-semibold'>
                      {appointment.name}
                    </p>
                    <p className='truncate text-xs text-muted-foreground'>
                      {appointment.type}
                    </p>
                  </div>
                  <button
                    className='text-xs font-semibold text-primary'
                    type='button'>
                    View
                  </button>
                </div>
              ))}
            </div>
            <button
              className='mt-3 flex w-full items-center justify-center gap-1 border-t border-border pt-4 text-xs font-bold text-primary hover:text-primary/80'
              type='button'>
              View full calendar <ArrowUpRightIcon className='size-3.5' />
            </button>
          </div>

          <div className='rounded-lg border border-border bg-card p-5 shadow-[0_8px_24px_rgba(27,45,75,0.04)] md:p-6'>
            <div className='mb-5 flex items-center justify-between'>
              <div>
                <h2 className='font-bold'>Needs attention</h2>
                <p className='mt-1 text-xs text-muted-foreground'>
                  Small actions, meaningful impact
                </p>
              </div>
              <span className='grid size-8 place-items-center rounded-full bg-[#fff4df] text-xs font-bold text-[#9a650f]'>
                4
              </span>
            </div>
            <div className='space-y-3'>
              <AttentionItem
                title='Review lab results'
                detail='2 results from yesterday'
                color='bg-[#f3b35b]'
              />
              <AttentionItem
                title='Sign care plan'
                detail='For Mia Thompson'
                color='bg-primary'
              />
              <AttentionItem
                title='Reply to patient'
                detail='Alex Morgan sent a message'
                color='bg-accent'
              />
              <AttentionItem
                title='Complete documentation'
                detail='End-of-day summary'
                color='bg-[#d98787]'
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default DoctorDashboardPage
