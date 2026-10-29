export interface NavItem {
  title: string
  href: string
  icon: string
}

export interface NavSection {
  title?: string
  items: NavItem[]
}

export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  INPROGRESS = 'INPROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED'
}

export interface PieChartData {
  status: string
  count: number
}

export interface BarChartData {
  month: string
  count: number
}

export interface BaseDashboardStats {
  appointmentCount: number
}

export interface AdminDashboardStats extends BaseDashboardStats {
  doctorCount: number
  patientCount: number
  superAdminCount: number
  adminCount: number
  paymentCount: number
  userCount: number
  totalRevenue: number
  pieChartData: PieChartData[]
  barChartData: BarChartData[]
}

export interface DoctorDashboardStats extends BaseDashboardStats {
  reviewCount: number
  patientCount: number
  totalRevenue: number
  appointmentStatusDistribution: PieChartData[]
}

export interface DashboardStatsByRole {
  SUPER_ADMIN: AdminDashboardStats
  ADMIN: AdminDashboardStats
  DOCTOR: DoctorDashboardStats
}
