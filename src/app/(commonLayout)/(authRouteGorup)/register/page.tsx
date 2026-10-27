import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { AuthShell } from '@/components/shared/AuthShell'
import { FloatingField } from '@/components/shared/AppField'

export default function RegisterPage() {
  return (
    <AuthShell>
      <form className='space-y-[22px]'>
        <FloatingField
          id='name'
          name='name'
          label='Full Name'
          placeholder='Your full name'
          autoComplete='name'
        />
        <FloatingField
          id='mobile'
          name='mobile'
          label='Mobile Number'
          type='tel'
          inputMode='numeric'
          placeholder='01XXXXXXXXX'
          autoComplete='tel'
        />
        <FloatingField
          id='email'
          name='email'
          label='Email'
          type='email'
          placeholder='name@example.com'
          autoComplete='email'
        />
        <FloatingField
          id='password'
          name='password'
          label='Password'
          type='password'
          placeholder='Min. 8 characters'
          autoComplete='new-password'
        />
        <FloatingField
          id='confirm'
          name='confirm'
          label='Confirm Password'
          type='password'
          placeholder='Repeat password'
          autoComplete='new-password'
        />

        <label className='flex cursor-pointer items-center gap-2.5 text-[13px]'>
          <Checkbox name='terms' /> I agree to the Terms &amp; Privacy Policy
        </label>

        <Button
          type='submit'
          className='h-[42px] w-full rounded-sm font-bold'>
          Create Account
        </Button>

        <Link
          href='/login'
          className='block text-center text-[13.5px] underline underline-offset-4 hover:text-primary'>
          Already have an account? Login
        </Link>
      </form>
    </AuthShell>
  )
}
