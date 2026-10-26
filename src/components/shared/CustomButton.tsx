import { cn } from '@/app/lib/utils'
import { Button } from '@/components/ui/button'
import type { ReactNode } from 'react'

type CustomButtonProps = {
  text: string
  className?: string
  icon?: ReactNode
}

const CustomButton = ({ text, className, icon }: CustomButtonProps) => {
  return (
    <Button
      className={cn(
        'h-11.5 rounded-sm bg-primary px-5 text-sm font-bold text-white shadow-[0_4px_10px_rgba(49,103,217,0.2)] hover:bg-primary/90',
        className
      )}>
      {text}
      {icon && <span aria-hidden='true'>{icon}</span>}
    </Button>
  )
}

export default CustomButton
