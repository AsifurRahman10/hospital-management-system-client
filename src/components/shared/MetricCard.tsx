import React from 'react'

export function MetricCard({
  label,
  value,
  detail,
  icon,
  tone
}: {
  label: string
  value: string
  detail: string
  icon: React.ReactNode
  tone: 'blue' | 'mint' | 'amber' | 'rose'
}) {
  const tones = {
    blue: 'bg-[#eaf0ff] text-primary',
    mint: 'bg-secondary text-secondary-foreground',
    amber: 'bg-[#fff4df] text-[#9a650f]',
    rose: 'bg-[#fbeaea] text-[#a64c4c]'
  }
  return (
    <div className='rounded-lg border border-border bg-card p-5 shadow-[0_8px_24px_rgba(27,45,75,0.04)]'>
      <div className='flex items-center justify-between'>
        <span className='text-xs font-semibold text-muted-foreground'>
          {label}
        </span>
        <span
          className={`grid size-8 place-items-center rounded-md ${tones[tone]}`}>
          {React.cloneElement(
            icon as React.ReactElement<{ className?: string }>,
            { className: 'size-4' }
          )}
        </span>
      </div>
      <p className='mt-4 text-3xl font-extrabold tracking-tight'>{value}</p>
      <p className='mt-1 text-xs text-muted-foreground'>{detail}</p>
    </div>
  )
}
