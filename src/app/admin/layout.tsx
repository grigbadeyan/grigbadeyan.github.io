import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/auth'
import AdminSidebar from '@/components/admin/AdminSidebar'

export const metadata = {
  title: 'Admin | Tsghotner',
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser()
  if (!user) {
    redirect('/admin/login')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f1117', fontFamily: 'system-ui, sans-serif' }}>
      <AdminSidebar username={user.username} />
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto', color: '#e2e8f0' }}>
        {children}
      </main>
    </div>
  )
}
