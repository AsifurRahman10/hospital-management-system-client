import { Suspense } from 'react'
import VerifyEmailForm from '@/components/modules/authModules/VerifyEmailForm'

interface VerifyEmailPageProps {
  searchParams: Promise<{ email?: string; unverified?: string }>
}

const VerifyEmailContent = async ({ searchParams }: VerifyEmailPageProps) => {
  const params = await searchParams
  return (
    <div>
      <VerifyEmailForm
        initialEmail={params.email}
        isUnverifiedWarning={params.unverified === 'true'}
      />
    </div>
  )
}

const VerifyEmailPage = ({ searchParams }: VerifyEmailPageProps) => (
  <Suspense fallback={null}>
    <VerifyEmailContent searchParams={searchParams} />
  </Suspense>
)

export default VerifyEmailPage