export function Skyline({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox='0 0 900 150'
      preserveAspectRatio='xMidYMax slice'
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 bottom-0 h-[150px] w-full text-muted-foreground opacity-30 ${className}`}>
      <g
        fill='none'
        stroke='currentColor'
        strokeWidth='1.2'>
        <path d='M0 135q60-22 130-8t140 4M0 148q90-24 190-10t200 6M520 142q80-26 160-8t220-4M600 150q90-20 170-6' />
        <path d='M120 112h160v-14H120zM120 112l20-14 20 14 20-14 20 14 20-14 20 14 20-14 20 14M130 112v26M270 112v26M170 138v-20M230 138v-20M120 98v40M280 98v40' />
        <path d='M340 150v-70q0-10 12-16 12 6 12 16v70M335 92h34M352 64v-14M345 50h14M300 150v-50h30v50M310 150v-26a5 5 0 0110 0v26' />
        <path d='M560 150v-60h46v60M566 150v-34a17 17 0 0134 0v34M556 90l27-26 27 26M583 64v-16' />
        <circle
          cx='583'
          cy='104'
          r='9'
        />
        <path d='M640 150v-44h120v44M640 106l30-18h60l30 18M650 150v-30M750 150v-30M700 150v-44M670 150v-18h60v18' />
        <path d='M790 150v-52l24-18 24 18v52M804 150v-28a10 10 0 0120 0v28M850 150v-38h40v38M856 120h28' />
      </g>
    </svg>
  )
}
