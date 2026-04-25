'use client'

import { useState, useEffect } from 'react'

interface Reservation {
  id: number
  name: string; phone: string; email: string
  room_name: string; message: string
  status: string; created_at: string
}

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  new: { bg: 'rgba(34,197,94,0.1)', text: '#22c55e', border: 'rgba(34,197,94,0.3)' },
  confirmed: { bg: 'rgba(59,130,246,0.1)', text: '#60a5fa', border: 'rgba(59,130,246,0.3)' },
  completed: { bg: 'rgba(100,116,139,0.1)', text: '#94a3b8', border: 'rgba(100,116,139,0.3)' },
  cancelled: { bg: 'rgba(239,68,68,0.1)', text: '#f87171', border: 'rgba(239,68,68,0.3)' },
}

export default function AdminReservationsPage() {
  const [items, setItems] = useState<Reservation[]>([])
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState<Reservation | null>(null)

  const load = async () => {
    const res = await fetch('/api/reservations')
    if (res.ok) setItems(await res.json())
  }
  useEffect(() => { load() }, [])

  const updateStatus = async (id: number, status: string) => {
    await fetch('/api/admin/reservations', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    load()
    if (selected?.id === id) setSelected(s => s ? { ...s, status } : null)
  }

  const filtered = filter === 'all' ? items : items.filter(i => i.status === filter)
  const counts = { all: items.length, new: items.filter(i => i.status === 'new').length, confirmed: items.filter(i => i.status === 'confirmed').length }

  return (
    <div style={{ display: 'flex', gap: '1.5rem', height: 'calc(100vh - 4rem)' }}>
      {/* List panel */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h1 style={{ color: '#f1f5f9', fontSize: '1.4rem', fontWeight: 600 }}>Reservations</h1>
            <p style={{ color: '#64748b', fontSize: '0.8rem' }}>{counts.new} new requests</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          {[['all', `All (${counts.all})`], ['new', `New (${counts.new})`], ['confirmed', 'Confirmed'], ['completed', 'Completed'], ['cancelled', 'Cancelled']].map(([val, label]) => (
            <button key={val} onClick={() => setFilter(val)} style={{
              padding: '0.35rem 0.875rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 500,
              background: filter === val ? 'rgba(212,160,23,0.15)' : '#2d3147',
              color: filter === val ? '#d4a017' : '#64748b',
            }}>{label}</button>
          ))}
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {filtered.map(r => {
            const sc = STATUS_COLORS[r.status] || STATUS_COLORS.new
            return (
              <div
                key={r.id}
                onClick={() => setSelected(r)}
                style={{
                  padding: '1rem 1.25rem',
                  background: selected?.id === r.id ? 'rgba(212,160,23,0.08)' : '#1a1d27',
                  border: `1px solid ${selected?.id === r.id ? 'rgba(212,160,23,0.3)' : '#2d3147'}`,
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ color: '#e2e8f0', fontWeight: 500, fontSize: '0.9rem' }}>{r.name}</div>
                    <div style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '0.15rem' }}>{r.phone}{r.room_name ? ` · ${r.room_name}` : ''}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                    <span style={{ padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}>{r.status}</span>
                    <span style={{ color: '#475569', fontSize: '0.7rem' }}>{new Date(r.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            )
          })}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>No reservations found</div>
          )}
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <div style={{ width: '340px', flexShrink: 0, background: '#1a1d27', border: '1px solid #2d3147', borderRadius: '12px', padding: '1.5rem', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h2 style={{ color: '#f1f5f9', fontWeight: 600 }}>Details</h2>
            <button onClick={() => setSelected(null)} style={{ color: '#64748b', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            {[
              ['👤 Name', selected.name],
              ['📞 Phone', selected.phone],
              ['📧 Email', selected.email || '—'],
              ['🏛 Room', selected.room_name || '—'],
              ['📅 Date', new Date(selected.created_at).toLocaleString()],
            ].map(([label, val]) => (
              <div key={label as string}>
                <div style={{ color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>{label as string}</div>
                <div style={{ color: '#e2e8f0', fontSize: '0.875rem' }}>{val as string}</div>
              </div>
            ))}

            {selected.message && (
              <div>
                <div style={{ color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>💬 Message</div>
                <div style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.6', background: '#0f1117', padding: '0.75rem', borderRadius: '6px' }}>{selected.message}</div>
              </div>
            )}
          </div>

          <div>
            <div style={{ color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Update Status</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              {['new', 'confirmed', 'completed', 'cancelled'].map(s => (
                <button
                  key={s}
                  onClick={() => updateStatus(selected.id, s)}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '6px',
                    border: `1px solid ${selected.status === s ? (STATUS_COLORS[s]?.border || '#2d3147') : '#2d3147'}`,
                    background: selected.status === s ? (STATUS_COLORS[s]?.bg || '#2d3147') : '#0f1117',
                    color: selected.status === s ? (STATUS_COLORS[s]?.text || '#94a3b8') : '#64748b',
                    cursor: 'pointer',
                    fontSize: '0.78rem',
                    fontWeight: selected.status === s ? 600 : 400,
                    textTransform: 'capitalize',
                  }}
                >{s}</button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #2d3147' }}>
            <a
              href={`tel:${selected.phone}`}
              style={{ display: 'block', textAlign: 'center', padding: '0.75rem', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '8px', color: '#22c55e', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}
            >
              📞 Call {selected.name}
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
