import Footer from '@/components/shared/Footer'
import { Navbar } from '@/components/shared/Navbar'

export default function CommonLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Navbar />
      <div>{children}</div>
      <Footer />
    </>
  )
}
