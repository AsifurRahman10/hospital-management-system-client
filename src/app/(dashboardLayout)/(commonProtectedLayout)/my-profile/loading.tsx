const MyProfileLoading = () => {
  return (
    <section className='mx-auto w-full max-w-6xl space-y-6 px-4 py-5 md:px-8 md:py-7'>
      <div className='animate-pulse space-y-6'>
        <div className='space-y-2'>
          <div className='h-8 w-44 rounded-md bg-muted' />
          <div className='h-4 w-72 rounded-md bg-muted' />
        </div>

        <div className='overflow-hidden rounded-2xl border border-border bg-card'>
          <div className='h-32 bg-muted' />
          <div className='px-6 pb-6'>
            <div className='-mt-12 flex items-end gap-4'>
              <div className='size-24 rounded-full border-4 border-card bg-muted md:size-28' />
              <div className='space-y-2 pb-2'>
                <div className='h-5 w-20 rounded bg-muted' />
                <div className='h-6 w-48 rounded bg-muted' />
                <div className='h-4 w-32 rounded bg-muted' />
              </div>
            </div>
          </div>
        </div>

        <div className='grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)]'>
          <div className='space-y-6'>
            <div className='h-64 rounded-xl border border-border bg-card p-6' />
            <div className='h-64 rounded-xl border border-border bg-card p-6' />
          </div>
          <div className='space-y-6'>
            <div className='h-28 rounded-xl bg-muted' />
            <div className='h-64 rounded-xl border border-border bg-card p-6' />
          </div>
        </div>
      </div>
    </section>
  )
}

export default MyProfileLoading
