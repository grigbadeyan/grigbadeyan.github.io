'use client'

import Link from 'next/link'

interface Stat {
  label: string
  value: number
  icon: string
  href: string
  color: string
}

export default function AdminDashboardCards({ stats }: { stats: Stat[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
      {stats.map(stat => (
        <Link key={stat.label} href={stat.href} style={{ textDecoration: 'none' }}>
          <div
            style={{ padding: '1.5rem', background: '#1a1d27', border: '1px solid #2d3147', borderRadius: '12px', transition: 'border-color 0.2s', cursor: 'pointer' }}
            onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.borderColor = stat.color)}
            onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.borderColor = '#2d3147')}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
            <div style={{ color: stat.color, fontSize: '2rem', fontWeight: 700 }}>{stat.value}</div>
            <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.25rem' }}>{stat.label}</div>
          </div>
        </Link>
      ))}
    </div>
  )
}
