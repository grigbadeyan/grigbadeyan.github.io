'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const navItems = [
  { href: '/admin', icon: '📊', label: 'Dashboard', exact: true },
  { href: '/admin/rooms', icon: '🏛', label: 'Rooms' },
  { href: '/admin/pages', icon: '📄', label: 'Pages' },
  { href: '/admin/gallery', icon: '🖼', label: 'Gallery' },
  { href: '/admin/reservations', icon: '📅', label: 'Reservations' },
  { href: '/admin/settings', icon: '⚙️', label: 'Settings' },
]

export default function AdminSidebar({ username }: { username: string }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <div style={{
      width: '240px',
      flexShrink: 0,
      background: '#1a1d27',
      borderRight: '1px solid #2d3147',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem 0',
    }}>
      {/* Logo */}
      <div style={{ padding: '0 1.5rem 1.5rem', borderBottom: '1px solid #2d3147' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px', height: '36px',
            background: 'linear-gradient(135deg, #b8880f, #d4a017)',
            borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.1rem',
          }}>🏛</div>
          <div>
            <div style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '0.95rem' }}>Tsghotner</div>
            <div style={{ color: '#64748b', fontSize: '0.7rem' }}>Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '1rem 0.75rem' }}>
        {navItems.map(item => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.75rem',
                borderRadius: '8px',
                marginBottom: '2px',
                textDecoration: 'none',
                background: isActive ? 'rgba(212,160,23,0.12)' : 'transparent',
                color: isActive ? '#d4a017' : '#94a3b8',
                fontSize: '0.875rem',
                fontWeight: isActive ? 500 : 400,
                transition: 'all 0.2s',
                border: isActive ? '1px solid rgba(212,160,23,0.2)' : '1px solid transparent',
              }}
            >
              <span style={{ fontSize: '1rem' }}>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #2d3147' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div style={{
            width: '32px', height: '32px',
            background: '#2d3147',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#d4a017', fontWeight: 600, fontSize: '0.85rem',
          }}>
            {username[0]?.toUpperCase()}
          </div>
          <div style={{ color: '#e2e8f0', fontSize: '0.85rem' }}>{username}</div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '0.5rem',
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '6px',
            color: '#f87171',
            fontSize: '0.8rem',
            cursor: 'pointer',
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}
