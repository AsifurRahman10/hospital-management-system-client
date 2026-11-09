import { Suspense } from 'react'

import RegisterForm from '@/components/modules/authModules/RegisterForm'

const RegisterContent = async () => {
  return (
    <div>
      <RegisterForm />
    </div>
  )
}

const RegisterPage = () => {
  return (
    <Suspense fallback={null}>
      <RegisterContent />
    </Suspense>
  )
}

export default RegisterPage
