import { getDb } from '@/lib/db'
import Link from 'next/link'

export default function AdminDashboard() {
  const db = getDb()
  const roomCount = (db.prepare('SELECT COUNT(*) as c FROM rooms WHERE is_active=1').get() as { c: number }).c
  const reservationCount = (db.prepare('SELECT COUNT(*) as c FROM reservations').get() as { c: number }).c
  const newReservations = (db.prepare("SELECT COUNT(*) as c FROM reservations WHERE status='new'").get() as { c: number }).c
  const pageCount = (db.prepare('SELECT COUNT(*) as c FROM pages').get() as { c: number }).c
  const recentReservations = db.prepare(`
    SELECT r.*, rm.name_en as room_name
    FROM reservations r LEFT JOIN rooms rm ON r.room_id = rm.id
    ORDER BY r.created_at DESC LIMIT 5
  `).all() as Array<{id: number; name: string; phone: string; room_name: string; status: string; created_at: string}>

  const stats = [
    { label: 'Active Rooms', value: roomCount, icon: '🏛', href: '/admin/rooms', color: '#d4a017' },
    { label: 'Total Reservations', value: reservationCount, icon: '📅', href: '/admin/reservations', color: '#3b82f6' },
    { label: 'New Requests', value: newReservations, icon: '🔔', href: '/admin/reservations', color: '#22c55e' },
    { label: 'Content Pages', value: pageCount, icon: '📄', href: '/admin/pages', color: '#a855f7' },
  ]

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: '#f1f5f9', fontSize: '1.5rem', fontWeight: 600 }}>Dashboard</h1>
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {stats.map(stat => (
          <Link key={stat.label} href={stat.href} style={{ textDecoration: 'none' }}>
            <div style={{
              padding: '1.5rem',
              background: '#1a1d27',
              border: '1px solid #2d3147',
              borderRadius: '12px',
              transition: 'border-color 0.2s',
              cursor: 'pointer',
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = stat.color)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#2d3147')}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
              <div style={{ color: stat.color, fontSize: '2rem', fontWeight: 700 }}>{stat.value}</div>
              <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.25rem' }}>{stat.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent reservations */}
      <div style={{ background: '#1a1d27', border: '1px solid #2d3147', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #2d3147', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ color: '#f1f5f9', fontSize: '1rem', fontWeight: 600 }}>Recent Reservations</h2>
          <Link href="/admin/reservations" style={{ color: '#d4a017', fontSize: '0.8rem' }}>View all →</Link>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#0f1117' }}>
                {['Name', 'Phone', 'Room', 'Status', 'Date'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1.5rem', textAlign: 'left', color: '#64748b', fontSize: '0.75rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentReservations.map(r => (
                <tr key={r.id} style={{ borderTop: '1px solid #2d3147' }}>
                  <td style={{ padding: '1rem 1.5rem', color: '#e2e8f0', fontSize: '0.875rem' }}>{r.name}</td>
                  <td style={{ padding: '1rem 1.5rem', color: '#94a3b8', fontSize: '0.875rem' }}>{r.phone}</td>
                  <td style={{ padding: '1rem 1.5rem', color: '#94a3b8', fontSize: '0.875rem' }}>{r.room_name || '—'}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{
                      padding: '0.2rem 0.6rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      background: r.status === 'new' ? 'rgba(34,197,94,0.1)' : 'rgba(100,116,139,0.1)',
                      color: r.status === 'new' ? '#22c55e' : '#64748b',
                      border: `1px solid ${r.status === 'new' ? 'rgba(34,197,94,0.3)' : 'rgba(100,116,139,0.3)'}`,
                    }}>
                      {r.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: '#64748b', fontSize: '0.8rem' }}>
                    {new Date(r.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {recentReservations.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No reservations yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.75rem', marginTop: '1.5rem' }}>
        {[
          { href: '/admin/rooms', label: 'Manage Rooms', icon: '🏛' },
          { href: '/admin/gallery', label: 'Upload Photos', icon: '🖼' },
          { href: '/admin/pages', label: 'Edit Pages', icon: '✏️' },
          { href: '/', label: 'View Website', icon: '🌐' },
        ].map(link => (
          <Link
            key={link.href}
            href={link.href}
            target={link.href === '/' ? '_blank' : undefined}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.75rem 1rem',
              background: '#1a1d27',
              border: '1px solid #2d3147',
              borderRadius: '8px',
              color: '#94a3b8',
              fontSize: '0.85rem',
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}
          >
            <span>{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
