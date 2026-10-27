import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import './globals.css'
import QueryProviders from '@/providers/queryProviders'

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  weight: ['400', '500', '700', '800']
})

export const metadata: Metadata = {
  title: 'Life Hospital Dental | Thoughtful care, healthier smiles',
  description:
    'Modern dental care with a thoughtful team, clear treatment plans, and a gentler patient experience.'
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang='en'
      className={`${manrope.variable} h-full antialiased`}>
      <body className='min-h-full'>
        <QueryProviders>{children}</QueryProviders>
      </body>
    </html>
  )
}
