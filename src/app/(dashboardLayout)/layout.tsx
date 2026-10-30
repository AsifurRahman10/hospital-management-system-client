import DashboardNavbar from '@/components/modules/dashboard/DashboardNavbar'
import { AppSidebar } from '@/components/modules/dashboard/DashBoardSiderbar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export default function CommonDashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SidebarProvider className='h-svh min-h-0 overflow-hidden'>
      <AppSidebar />
      <SidebarInset className='h-full min-h-0 overflow-hidden'>
        <DashboardNavbar />
        <main className='min-h-0 flex-1 overflow-y-auto'>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
