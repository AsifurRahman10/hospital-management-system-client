import Link from 'next/link'

const Footer = () => {
  return (
    <footer className='border-t border-border bg-white py-7'>
      <div className='container-custom flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between'>
        <p className='font-extrabold text-foreground'>Life Hospital</p>
        <p>Comprehensive healthcare and total hospital services.</p>
        <Link
          href='#top'
          className='font-semibold text-primary hover:underline'>
          Back to top
        </Link>
      </div>
    </footer>
  )
}

export default Footer
