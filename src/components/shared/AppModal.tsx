'use client'

import { cn } from '@/app/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { ReactNode } from 'react'

export type ModalSize =
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | 'full'

interface AppModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: ReactNode
  description?: ReactNode
  icon?: ReactNode
  trigger?: ReactNode
  children: ReactNode
  footer?: ReactNode
  size?: ModalSize
  className?: string
  contentClassName?: string
  showCloseButton?: boolean
}

const SIZE_CLASSES: Record<ModalSize, string> = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  '2xl': 'sm:max-w-2xl',
  '3xl': 'sm:max-w-3xl',
  '4xl': 'sm:max-w-4xl',
  full: 'w-[calc(100vw-2rem)] max-w-6xl'
}

export const AppModal = ({
  open,
  onOpenChange,
  title,
  description,
  icon,
  trigger,
  children,
  footer,
  size = 'lg',
  className,
  contentClassName,
  showCloseButton = true
}: AppModalProps) => {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger render={<>{trigger}</>} />}
      <DialogContent
        showCloseButton={showCloseButton}
        className={cn(
          'flex max-h-[85vh] w-[calc(100vw-2rem)] flex-col gap-0 overflow-hidden p-0 shadow-xl sm:rounded-2xl',
          SIZE_CLASSES[size],
          className
        )}>
        {/* Header */}
        <DialogHeader className='shrink-0 border-b border-border/60 px-6 py-4 text-left'>
          <div className='flex items-center gap-3 pr-6'>
            {icon && (
              <div className='flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                {icon}
              </div>
            )}
            <div>
              <DialogTitle className='text-base font-bold text-foreground md:text-lg'>
                {title}
              </DialogTitle>
              {description && (
                <DialogDescription className='mt-0.5 text-xs text-muted-foreground'>
                  {description}
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Content Body */}
        <div
          className={cn(
            'flex-1 overflow-y-auto px-6 py-4 overscroll-contain',
            contentClassName
          )}>
          {children}
        </div>

        {/* Optional Footer */}
        {footer && (
          <div className='shrink-0 border-t border-border/60 bg-muted/20 px-6 py-3.5'>
            {footer}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default AppModal
