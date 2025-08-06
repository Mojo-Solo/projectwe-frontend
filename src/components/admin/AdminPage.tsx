import { redirect } from 'next/navigation'
import { getServerSideSession } from '@/lib/session-utils'
import AdminLayout from './AdminLayout'

interface AdminPageProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export default async function AdminPage({ children, requireAuth = true }: AdminPageProps) {
  if (requireAuth) {
    try {
      const session = await getServerSideSession()
      
      if (!session) {
        redirect('/auth/signin')
      }
    } catch (error) {
      console.error('Error checking admin session:', error)
      redirect('/auth/signin')
    }
  }

  return <AdminLayout>{children}</AdminLayout>
}

// Server-side session checker for admin routes
export async function checkAdminAuth() {
  try {
    const session = await getServerSideSession()
    return session
  } catch (error) {
    console.error('Admin auth check failed:', error)
    return null
  }
}