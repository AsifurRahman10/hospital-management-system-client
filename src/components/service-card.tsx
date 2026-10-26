import Link from 'next/link'
import { ArrowRight, type LucideIcon } from 'lucide-react'

type ServiceCardProps = {
  icon: LucideIcon
  title: string
  description: string
}

export function ServiceCard({
  icon: Icon,
  title,
  description
}: ServiceCardProps) {
  return (
    <article className='flex min-h-[250px] flex-col items-start rounded-[20px] bg-white p-7 shadow-[0_12px_36px_rgba(29,54,91,0.035)] sm:p-8'>
      <span className='grid size-[52px] place-items-center rounded-[16px] bg-secondary text-primary'>
        <Icon
          size={24}
          strokeWidth={1.8}
          aria-hidden='true'
        />
      </span>
      <h3 className='mt-6 text-xl font-extrabold leading-tight text-foreground'>
        {title}
      </h3>
      <p className='mt-3 text-sm leading-6 text-muted-foreground'>
        {description}
      </p>
      <Link
        href='#contact'
        className='mt-auto inline-flex min-h-11 items-center gap-2 pt-5 text-sm font-extrabold text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'>
        Ask about this service{' '}
        <ArrowRight
          size={15}
          aria-hidden='true'
        />
      </Link>
    </article>
  )
}
