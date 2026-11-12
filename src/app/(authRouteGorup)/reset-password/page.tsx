import { Suspense } from 'react'
import ResetPasswordForm from '@/components/modules/authModules/ResetPasswordForm'

interface ResetPasswordPageProps {
  searchParams: Promise<{ email?: string }>
}

const ResetPasswordContent = async ({
  searchParams
}: ResetPasswordPageProps) => {
  const params = await searchParams
  return (
    <div>
      <ResetPasswordForm initialEmail={params.email} />
    </div>
  )
}

const ResetPasswordPage = ({ searchParams }: ResetPasswordPageProps) => (
  <Suspense fallback={null}>
    <ResetPasswordContent searchParams={searchParams} />
  </Suspense>
)

export default ResetPasswordPage
