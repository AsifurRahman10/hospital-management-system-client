import { Suspense } from 'react'
import LoginForm from '@/components/modules/authModules/LoginForm'

interface LoginParams {
  searchParams: Promise<{ redirect?: string; authError?: string }>
}

const LoginContent = async ({ searchParams }: LoginParams) => {
  const params = await searchParams
  const redirectPath = params.redirect
  return (
    <div>
      <LoginForm
        redirectPath={redirectPath}
        authError={params.authError}
      />
    </div>
  )
}

const LoginPage = ({ searchParams }: LoginParams) => (
  <Suspense fallback={null}>
    <LoginContent searchParams={searchParams} />
  </Suspense>
)

export default LoginPage