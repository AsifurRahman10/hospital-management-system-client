import { cn } from '@/app/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import type { ReactNode } from 'react'

type CustomButtonProps = {
  text: string
  className?: string
  icon?: ReactNode
  href?: string
  onClick?: () => void
}

const CustomButton = ({
  text,
  className,
  icon,
  href,
  onClick
}: CustomButtonProps) => {
  const classes = cn(
    buttonVariants(),
    'h-11.5 rounded-sm bg-primary px-5 text-sm font-bold text-white shadow-[0_4px_10px_rgba(49,103,217,0.2)]',
    className
  )

  if (href) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={classes}>
        {text}
        {icon && <span aria-hidden='true'>{icon}</span>}
      </Link>
    )
  }

  return (
    <span
      onClick={onClick}
      className={classes}>
      {text}
      {icon && <span aria-hidden='true'>{icon}</span>}
    </span>
  )
}

export default CustomButton
