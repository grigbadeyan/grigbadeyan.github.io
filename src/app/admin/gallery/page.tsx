'use client'

import { useState, useEffect, useCallback } from 'react'

interface GalleryItem {
  id: number
  image_path: string
  alt_hy: string; alt_ru: string; alt_en: string
  category: string
  sort_order: number
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [msg, setMsg] = useState('')

  const load = async () => {
    const res = await fetch('/api/admin/gallery')
    setItems(await res.json())
  }
  useEffect(() => { load() }, [])

  const uploadFile = async (file: File) => {
    setUploading(true)
    try {
      const fd = new FormData(); fd.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) {
        await fetch('/api/admin/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image_path: data.url, sort_order: items.length })
        })
        setMsg('Image uploaded!')
        load()
      }
    } finally { setUploading(false) }
  }

  const handleFiles = (files: FileList) => {
    Array.from(files).forEach(f => uploadFile(f))
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false)
    handleFiles(e.dataTransfer.files)
  }, [items.length])

  const del = async (id: number) => {
    if (!confirm('Delete this image?')) return
    await fetch('/api/admin/gallery', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    load()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ color: '#f1f5f9', fontSize: '1.4rem', fontWeight: 600 }}>Gallery</h1>
          <p style={{ color: '#64748b', fontSize: '0.8rem' }}>{items.length} images</p>
        </div>
        <label htmlFor="gallery-upload" style={{ padding: '0.6rem 1.25rem', background: 'rgba(212,160,23,0.15)', border: '1px solid rgba(212,160,23,0.4)', borderRadius: '8px', color: '#d4a017', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 500 }}>
          📷 Upload Images
        </label>
        <input id="gallery-upload" type="file" accept="image/*" multiple onChange={e => e.target.files && handleFiles(e.target.files)} style={{ display: 'none' }} />
      </div>

      {msg && <div style={{ padding: '0.75rem 1rem', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '8px', color: '#22c55e', marginBottom: '1rem', fontSize: '0.85rem' }}>{msg}</div>}

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        style={{
          border: `2px dashed ${dragOver ? '#d4a017' : '#2d3147'}`,
          borderRadius: '12px',
          padding: '2.5rem',
          textAlign: 'center',
          marginBottom: '1.5rem',
          background: dragOver ? 'rgba(212,160,23,0.05)' : 'transparent',
          transition: 'all 0.2s',
        }}
      >
        {uploading ? (
          <div style={{ color: '#d4a017', fontSize: '0.9rem' }}>⏳ Uploading...</div>
        ) : (
          <>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🖼</div>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Drag & drop images here, or use the upload button</p>
            <p style={{ color: '#475569', fontSize: '0.75rem', marginTop: '0.25rem' }}>JPEG, PNG, WebP — max 10MB each</p>
          </>
        )}
      </div>

      {/* Gallery grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {items.map(item => (
          <div key={item.id} style={{ position: 'relative', group: 'true' } as React.CSSProperties}>
            <img
              src={item.image_path}
              alt={item.alt_en || ''}
              style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #2d3147', display: 'block' }}
            />
            <button
              onClick={() => del(item.id)}
              style={{
                position: 'absolute', top: '0.5rem', right: '0.5rem',
                background: 'rgba(239,68,68,0.85)', border: 'none', borderRadius: '50%',
                width: '28px', height: '28px', cursor: 'pointer',
                color: 'white', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              ✕
            </button>
            <div style={{ marginTop: '0.5rem', padding: '0 0.25rem' }}>
              <input
                defaultValue={item.alt_en}
                placeholder="Alt text (EN)"
                style={{ width: '100%', background: '#0f1117', border: '1px solid #2d3147', borderRadius: '4px', padding: '0.35rem 0.5rem', color: '#94a3b8', fontSize: '0.72rem', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && !uploading && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🖼</div>
          <p>No images yet. Upload some photos to fill the gallery.</p>
        </div>
      )}
    </div>
  )
}
