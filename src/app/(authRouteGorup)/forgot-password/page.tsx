import { Suspense } from 'react'
import ForgotPasswordForm from '@/components/modules/authModules/ForgotPasswordForm'

const ForgotPasswordContent = async () => {
  return (
    <div>
      <ForgotPasswordForm />
    </div>
  )
}

const ForgotPasswordPage = () => {
  return (
    <Suspense fallback={null}>
      <ForgotPasswordContent />
    </Suspense>
  )
}

export default ForgotPasswordPage
