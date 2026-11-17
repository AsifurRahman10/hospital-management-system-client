import Footer from '@/components/shared/Footer'
import { Navbar } from '@/components/shared/Navbar'
import { Chatbot } from '@/components/modules/chatbot/Chatbot'

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
      <Chatbot />
    </>
  )
}
