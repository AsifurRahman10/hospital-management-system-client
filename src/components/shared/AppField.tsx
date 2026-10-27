'use client'

import { useState, type ReactNode } from 'react'
import type { AnyFieldApi } from '@tanstack/react-form'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/app/lib/utils'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

type AppFieldProps = {
  field: AnyFieldApi
  label: string
  type?: 'text' | 'email' | 'password' | 'number'
  placeholder?: string
  prepend?: ReactNode
  append?: ReactNode
  className?: string
  disabled?: boolean
  autoComplete?: string
}

function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error
  }

  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message
  }

  return String(error)
}

export default function AppField({
  field,
  label,
  type = 'text',
  placeholder,
  prepend,
  append,
  className,
  disabled = false,
  autoComplete
}: AppFieldProps) {
  const [showPassword, setShowPassword] = useState(false)

  const isPassword = type === 'password'

  const inputType = isPassword && showPassword ? 'text' : type

  const firstError = field.state.meta.isTouched
    ? field.state.meta.errors[0]
    : undefined

  const errorMessage =
    firstError === undefined ? undefined : getErrorMessage(firstError)

  const hasError = Boolean(errorMessage)

  const inputValue = field.state.value as string | number | undefined

  return (
    <div className={cn('w-full space-y-1.5', className)}>
      <div className='group relative'>
        <Label
          htmlFor={field.name}
          className={cn(
            'absolute -top-2 left-3 z-10 bg-card px-1',
            'text-[11.5px] font-medium text-muted-foreground',
            'transition-colors group-focus-within:text-primary',
            hasError && 'text-destructive'
          )}>
          {label}
        </Label>

        {prepend && (
          <div className='pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3'>
            {prepend}
          </div>
        )}

        <Input
          id={field.name}
          name={field.name}
          type={inputType}
          value={inputValue ?? ''}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          onBlur={field.handleBlur}
          onChange={(event) => {
            const value =
              type === 'number'
                ? event.target.value === ''
                  ? ''
                  : event.target.valueAsNumber
                : event.target.value

            field.handleChange(value)
          }}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${field.name}-error` : undefined}
          className={cn(
            'h-[42px] rounded-sm bg-transparent px-3.5 text-sm',
            prepend && 'pl-10',
            (append || isPassword) && 'pr-10',
            hasError && 'border-destructive focus-visible:ring-destructive/20'
          )}
        />

        {append ? (
          <div className='absolute inset-y-0 right-0 z-10 flex items-center pr-3'>
            {append}
          </div>
        ) : isPassword ? (
          <button
            type='button'
            onClick={() => setShowPassword((previous) => !previous)}
            disabled={disabled}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
            className='absolute right-1.5 top-1/2 z-10 grid size-8 -translate-y-1/2 place-items-center rounded-sm text-muted-foreground transition-colors hover:text-primary disabled:pointer-events-none disabled:opacity-50'>
            {showPassword ? (
              <EyeOff className='size-[18px]' />
            ) : (
              <Eye className='size-[18px]' />
            )}
          </button>
        ) : null}
      </div>

      {hasError && (
        <p
          id={`${field.name}-error`}
          role='alert'
          className='text-xs text-destructive'>
          {errorMessage}
        </p>
      )}
    </div>
  )
}
