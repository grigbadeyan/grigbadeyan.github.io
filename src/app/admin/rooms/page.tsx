'use client'

import { useState, useEffect } from 'react'

interface Room {
  id: number
  slug: string
  name_hy: string; name_ru: string; name_en: string
  description_hy: string; description_ru: string; description_en: string
  features_hy: string; features_ru: string; features_en: string
  price: number; capacity: number; area: number
  cover_image: string; sort_order: number; is_active: number
}

const empty: Partial<Room> = {
  slug: '', name_hy: '', name_ru: '', name_en: '',
  description_hy: '', description_ru: '', description_en: '',
  features_hy: '', features_ru: '', features_en: '',
  price: 0, capacity: 10, area: 0, cover_image: '', sort_order: 0, is_active: 1,
}

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [editing, setEditing] = useState<Partial<Room> | null>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [tab, setTab] = useState<'hy' | 'ru' | 'en'>('hy')

  const load = async () => {
    const res = await fetch('/api/admin/rooms')
    setRooms(await res.json())
  }
  useEffect(() => { load() }, [])

  const save = async () => {
    setSaving(true)
    setMsg('')
    try {
      const method = editing?.id ? 'PUT' : 'POST'
      // Convert features string to array
      const body = {
        ...editing,
        features_hy: toArr(editing?.features_hy),
        features_ru: toArr(editing?.features_ru),
        features_en: toArr(editing?.features_en),
      }
      const res = await fetch('/api/admin/rooms', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (res.ok) { setMsg('Saved!'); setEditing(null); load() }
      else { const d = await res.json(); setMsg(d.error || 'Error') }
    } finally { setSaving(false) }
  }

  const del = async (id: number) => {
    if (!confirm('Delete this room?')) return
    await fetch('/api/admin/rooms', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    load()
  }

  const uploadImage = async (file: File) => {
    setUploading(true)
    try {
      const fd = new FormData(); fd.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) setEditing(e => ({ ...e, cover_image: data.url }))
    } finally { setUploading(false) }
  }

  const toArr = (val?: string) => {
    if (!val) return []
    try { const p = JSON.parse(val); return Array.isArray(p) ? p : [] } catch { return val.split('\n').map(s => s.trim()).filter(Boolean) }
  }
  const fromArr = (val: string) => {
    try { const p = JSON.parse(val); return Array.isArray(p) ? p.join('\n') : val } catch { return val }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ color: '#f1f5f9', fontSize: '1.4rem', fontWeight: 600 }}>Rooms</h1>
          <p style={{ color: '#64748b', fontSize: '0.8rem' }}>{rooms.length} rooms total</p>
        </div>
        <button onClick={() => setEditing({ ...empty })} className="btn-admin-primary">+ Add Room</button>
      </div>

      {msg && <div style={{ padding: '0.75rem 1rem', background: msg === 'Saved!' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${msg === 'Saved!' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`, borderRadius: '8px', color: msg === 'Saved!' ? '#22c55e' : '#f87171', marginBottom: '1rem', fontSize: '0.85rem' }}>{msg}</div>}

      {/* Room list */}
      {!editing && (
        <div style={{ background: '#1a1d27', border: '1px solid #2d3147', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#0f1117' }}>
                {['Cover', 'Name (EN)', 'Slug', 'Price (AMD)', 'Capacity', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rooms.map(room => (
                <tr key={room.id} style={{ borderTop: '1px solid #2d3147' }}>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    {room.cover_image
                      ? <img src={room.cover_image} alt="" style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                      : <div style={{ width: '60px', height: '40px', background: '#2d3147', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>🏛</div>}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: '#e2e8f0', fontSize: '0.875rem', fontWeight: 500 }}>{room.name_en}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#64748b', fontSize: '0.8rem', fontFamily: 'monospace' }}>{room.slug}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#d4a017', fontSize: '0.875rem' }}>{room.price ? room.price.toLocaleString() : '—'}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#94a3b8', fontSize: '0.875rem' }}>{room.capacity}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.72rem', background: room.is_active ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: room.is_active ? '#22c55e' : '#f87171', border: `1px solid ${room.is_active ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
                      {room.is_active ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <button onClick={() => setEditing({ ...room, features_hy: fromArr(room.features_hy), features_ru: fromArr(room.features_ru), features_en: fromArr(room.features_en) })} style={btnStyle('blue')}>Edit</button>
                    <button onClick={() => del(room.id)} style={{ ...btnStyle('red'), marginLeft: '0.5rem' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Editor */}
      {editing && (
        <div style={{ background: '#1a1d27', border: '1px solid #2d3147', borderRadius: '12px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h2 style={{ color: '#f1f5f9', fontSize: '1.1rem', fontWeight: 600 }}>{editing.id ? 'Edit Room' : 'New Room'}</h2>
            <button onClick={() => setEditing(null)} style={{ color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
          </div>

          {/* Slug + Price row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <Field label="Slug (URL)" value={editing.slug || ''} onChange={v => setEditing(e => ({ ...e, slug: v }))} placeholder="royal" />
            <Field label="Price (AMD/hour)" type="number" value={String(editing.price || '')} onChange={v => setEditing(e => ({ ...e, price: Number(v) }))} />
            <Field label="Capacity (guests)" type="number" value={String(editing.capacity || '')} onChange={v => setEditing(e => ({ ...e, capacity: Number(v) }))} />
            <Field label="Area (m²)" type="number" value={String(editing.area || '')} onChange={v => setEditing(e => ({ ...e, area: Number(v) }))} />
          </div>

          {/* Language tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            {(['hy', 'ru', 'en'] as const).map(l => (
              <button key={l} onClick={() => setTab(l)} style={{
                padding: '0.4rem 1rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500,
                background: tab === l ? 'rgba(212,160,23,0.15)' : '#2d3147',
                color: tab === l ? '#d4a017' : '#94a3b8',
                borderBottom: tab === l ? '2px solid #d4a017' : '2px solid transparent',
              }}>
                {l === 'hy' ? '🇦🇲 Հայ' : l === 'ru' ? '🇷🇺 Рус' : '🇬🇧 Eng'}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <Field label={`Name (${tab})`} value={(editing as Record<string, unknown>)[`name_${tab}`] as string || ''} onChange={v => setEditing(e => ({ ...e, [`name_${tab}`]: v }))} />
            <Field label={`Description (${tab})`} type="textarea" rows={4} value={(editing as Record<string, unknown>)[`description_${tab}`] as string || ''} onChange={v => setEditing(e => ({ ...e, [`description_${tab}`]: v }))} />
            <Field label={`Features (${tab}) — one per line`} type="textarea" rows={3} value={(editing as Record<string, unknown>)[`features_${tab}`] as string || ''} onChange={v => setEditing(e => ({ ...e, [`features_${tab}`]: v }))} placeholder="Pool&#10;Sauna&#10;Jacuzzi" />
          </div>

          {/* Cover image */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={labelStyle}>Cover Image</label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              {editing.cover_image && (
                <img src={editing.cover_image} alt="" style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #2d3147' }} />
              )}
              <div>
                <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0])} style={{ display: 'none' }} id="cover-upload" />
                <label htmlFor="cover-upload" style={{ ...btnStyle('gold'), display: 'inline-block', cursor: 'pointer' }}>
                  {uploading ? 'Uploading...' : '📷 Upload Image'}
                </label>
                <Field label="Or paste URL" value={editing.cover_image || ''} onChange={v => setEditing(e => ({ ...e, cover_image: v }))} />
              </div>
            </div>
          </div>

          {/* Settings row */}
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '1.5rem' }}>
            <Field label="Sort Order" type="number" value={String(editing.sort_order || 0)} onChange={v => setEditing(e => ({ ...e, sort_order: Number(v) }))} />
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.85rem', cursor: 'pointer', marginTop: '1.5rem' }}>
              <input type="checkbox" checked={!!editing.is_active} onChange={e => setEditing(ed => ({ ...ed, is_active: e.target.checked ? 1 : 0 }))} />
              Active (visible on website)
            </label>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={save} disabled={saving} style={{ ...btnStyle('gold'), padding: '0.75rem 2rem', fontSize: '0.875rem' }}>
              {saving ? 'Saving...' : editing.id ? 'Save Changes' : 'Create Room'}
            </button>
            <button onClick={() => setEditing(null)} style={{ ...btnStyle('gray'), padding: '0.75rem 2rem', fontSize: '0.875rem' }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', rows = 3, placeholder = '' }: { label: string; value: string; onChange: (v: string) => void; type?: string; rows?: number; placeholder?: string }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {type === 'textarea'
        ? <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows} placeholder={placeholder} style={inputStyle as React.CSSProperties} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={inputStyle as React.CSSProperties} />}
    </div>
  )
}

const labelStyle: React.CSSProperties = { display: 'block', color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.4rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }
const inputStyle = { width: '100%', padding: '0.65rem 0.875rem', background: '#0f1117', border: '1px solid #2d3147', borderRadius: '6px', color: '#f1f5f9', fontSize: '0.875rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'system-ui' }

function btnStyle(color: 'blue' | 'red' | 'gold' | 'gray'): React.CSSProperties {
  const colors = {
    blue: { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.3)', text: '#60a5fa' },
    red: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', text: '#f87171' },
    gold: { bg: 'rgba(212,160,23,0.15)', border: 'rgba(212,160,23,0.4)', text: '#d4a017' },
    gray: { bg: '#2d3147', border: '#3d4257', text: '#94a3b8' },
  }
  const c = colors[color]
  return { padding: '0.35rem 0.75rem', background: c.bg, border: `1px solid ${c.border}`, borderRadius: '6px', color: c.text, fontSize: '0.8rem', cursor: 'pointer', fontWeight: 500 }
}
