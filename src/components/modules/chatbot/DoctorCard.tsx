import { IDoctorCard } from '@/types/chatbot.types'
import { Badge } from '@/components/ui/badge'
import { Stethoscope, Building2, Clock, DollarSign } from 'lucide-react'
import Link from 'next/link'

export function DoctorCard({ doc }: { doc: IDoctorCard }) {
  return (
    <div className='rounded-xl border border-border bg-background p-3 space-y-2'>
      {/* Name + Specialty */}
      <div className='flex items-start justify-between gap-2'>
        <div className='flex items-center gap-2 min-w-0'>
          <div className='flex-shrink-0 size-7 rounded-full bg-primary/10 flex items-center justify-center'>
            <Stethoscope className='size-3.5 text-primary' />
          </div>
          <span className='text-sm font-semibold text-foreground truncate'>
            {doc.name}
          </span>
        </div>
        <Badge variant='secondary' className='flex-shrink-0 text-xs'>
          {doc.specialty}
        </Badge>
      </div>

      {/* Reason */}
      <p className='text-xs text-muted-foreground leading-relaxed'>
        {doc.reason}
      </p>

      {/* Meta chips */}
      <div className='flex flex-wrap gap-1.5'>
        {doc.experience && (
          <span className='inline-flex items-center gap-1 text-xs text-muted-foreground'>
            <Clock className='size-3' />
            {doc.experience}
          </span>
        )}
        {doc.hospital && (
          <span className='inline-flex items-center gap-1 text-xs text-muted-foreground'>
            <Building2 className='size-3' />
            {doc.hospital}
          </span>
        )}
        {doc.fee && (
          <span className='inline-flex items-center gap-1 text-xs text-muted-foreground'>
            <DollarSign className='size-3' />
            {doc.fee}
          </span>
        )}
      </div>

      {/* CTA */}
      <Link
        href='/doctors'
        className='inline-flex w-full h-7 items-center justify-center rounded-lg border border-border bg-background px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-muted cursor-pointer'
      >
        View Profile
      </Link>
    </div>
  )
}
