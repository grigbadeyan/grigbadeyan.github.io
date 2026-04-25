'use client'

import { useState, useEffect } from 'react'

interface Page {
  id: number; slug: string
  title_hy: string; title_ru: string; title_en: string
  content_hy: string; content_ru: string; content_en: string
  meta_title_hy: string; meta_title_ru: string; meta_title_en: string
  meta_description_hy: string; meta_description_ru: string; meta_description_en: string
}

const empty: Partial<Page> = {
  slug: '', title_hy: '', title_ru: '', title_en: '',
  content_hy: '', content_ru: '', content_en: '',
  meta_title_hy: '', meta_title_ru: '', meta_title_en: '',
  meta_description_hy: '', meta_description_ru: '', meta_description_en: '',
}

export default function AdminPagesPage() {
  const [pages, setPages] = useState<Page[]>([])
  const [editing, setEditing] = useState<Partial<Page> | null>(null)
  const [tab, setTab] = useState<'hy' | 'ru' | 'en'>('hy')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const load = async () => {
    const res = await fetch('/api/admin/pages')
    if (res.ok) setPages(await res.json())
  }
  useEffect(() => { load() }, [])

  const save = async () => {
    setSaving(true); setMsg('')
    const method = editing?.id ? 'PUT' : 'POST'
    const res = await fetch('/api/admin/pages', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editing) })
    if (res.ok) { setMsg('Saved!'); setEditing(null); load() }
    else { const d = await res.json(); setMsg(d.error || 'Error') }
    setSaving(false)
  }

  const del = async (id: number) => {
    if (!confirm('Delete this page?')) return
    await fetch('/api/admin/pages', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    load()
  }

  const inp = (style?: React.CSSProperties): React.CSSProperties => ({
    width: '100%', padding: '0.65rem 0.875rem', background: '#0f1117',
    border: '1px solid #2d3147', borderRadius: '6px', color: '#f1f5f9',
    fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'system-ui',
    ...style,
  })
  const lbl: React.CSSProperties = { display: 'block', color: '#94a3b8', fontSize: '0.72rem', marginBottom: '0.4rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }

  const set = (key: string, val: string) => setEditing(e => ({ ...e, [key]: val }))
  const get = (key: string) => (editing as Record<string, unknown>)?.[key] as string || ''

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ color: '#f1f5f9', fontSize: '1.4rem', fontWeight: 600 }}>Pages</h1>
          <p style={{ color: '#64748b', fontSize: '0.8rem' }}>Manage content pages with SEO fields</p>
        </div>
        <button onClick={() => setEditing({ ...empty })} style={{ padding: '0.6rem 1.25rem', background: 'rgba(212,160,23,0.15)', border: '1px solid rgba(212,160,23,0.4)', borderRadius: '8px', color: '#d4a017', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}>+ New Page</button>
      </div>

      {msg && <div style={{ padding: '0.75rem 1rem', background: msg === 'Saved!' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${msg === 'Saved!' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`, borderRadius: '8px', color: msg === 'Saved!' ? '#22c55e' : '#f87171', marginBottom: '1rem', fontSize: '0.85rem' }}>{msg}</div>}

      {!editing && (
        <div style={{ background: '#1a1d27', border: '1px solid #2d3147', borderRadius: '12px', overflow: 'hidden' }}>
          {pages.length === 0 && (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📄</div>
              <p>No pages yet. Create your first page.</p>
            </div>
          )}
          {pages.map((p, i) => (
            <div key={p.id} style={{ padding: '1rem 1.5rem', borderTop: i > 0 ? '1px solid #2d3147' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: '#e2e8f0', fontWeight: 500, fontSize: '0.9rem' }}>{p.title_en || p.title_hy}</div>
                <div style={{ color: '#64748b', fontSize: '0.78rem', fontFamily: 'monospace', marginTop: '0.15rem' }}>/{p.slug}</div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => setEditing(p)} style={{ padding: '0.35rem 0.75rem', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '6px', color: '#60a5fa', cursor: 'pointer', fontSize: '0.8rem' }}>Edit</button>
                <button onClick={() => del(p.id)} style={{ padding: '0.35rem 0.75rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', color: '#f87171', cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div style={{ background: '#1a1d27', border: '1px solid #2d3147', borderRadius: '12px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h2 style={{ color: '#f1f5f9', fontWeight: 600 }}>{editing.id ? 'Edit Page' : 'New Page'}</h2>
            <button onClick={() => setEditing(null)} style={{ color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={lbl}>Slug (URL path)</label>
            <input value={get('slug')} onChange={e => set('slug', e.target.value)} style={inp()} placeholder="about" />
          </div>

          {/* Language tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            {(['hy', 'ru', 'en'] as const).map(l => (
              <button key={l} onClick={() => setTab(l)} style={{
                padding: '0.4rem 1rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500,
                background: tab === l ? 'rgba(212,160,23,0.15)' : '#2d3147',
                color: tab === l ? '#d4a017' : '#94a3b8',
              }}>
                {l === 'hy' ? '🇦🇲 Հայ' : l === 'ru' ? '🇷🇺 Рус' : '🇬🇧 Eng'}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={lbl}>Title ({tab})</label>
              <input value={get(`title_${tab}`)} onChange={e => set(`title_${tab}`, e.target.value)} style={inp()} placeholder="Page Title" />
            </div>
            <div>
              <label style={lbl}>Content ({tab})</label>
              <textarea value={get(`content_${tab}`)} onChange={e => set(`content_${tab}`, e.target.value)} rows={8} style={inp({ resize: 'vertical' })} placeholder="Page content..." />
            </div>
          </div>

          {/* SEO */}
          <div style={{ padding: '1.25rem', background: '#0f1117', borderRadius: '8px', marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>🔍 SEO ({tab})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={lbl}>Meta Title</label>
                <input value={get(`meta_title_${tab}`)} onChange={e => set(`meta_title_${tab}`, e.target.value)} style={inp()} placeholder="SEO title" />
              </div>
              <div>
                <label style={lbl}>Meta Description</label>
                <textarea value={get(`meta_description_${tab}`)} onChange={e => set(`meta_description_${tab}`, e.target.value)} rows={2} style={inp({ resize: 'vertical' })} placeholder="SEO description (150-160 chars)" />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={save} disabled={saving} style={{ padding: '0.75rem 2rem', background: 'rgba(212,160,23,0.15)', border: '1px solid rgba(212,160,23,0.4)', borderRadius: '8px', color: '#d4a017', cursor: 'pointer', fontWeight: 500 }}>
              {saving ? 'Saving...' : 'Save Page'}
            </button>
            <button onClick={() => setEditing(null)} style={{ padding: '0.75rem 2rem', background: '#2d3147', border: '1px solid #3d4257', borderRadius: '8px', color: '#94a3b8', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}
