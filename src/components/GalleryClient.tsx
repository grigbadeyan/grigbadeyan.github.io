'use client'

import { useState } from 'react'
import { type Locale, getLocalizedField } from '@/lib/i18n'

interface GalleryImage {
  id: number
  image_path: string
  alt_hy: string; alt_ru: string; alt_en: string
}

export default function GalleryClient({ images, locale }: { images: GalleryImage[]; locale: Locale }) {
  const [lightbox, setLightbox] = useState<number | null>(null)

  if (images.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
        {locale === 'hy' ? 'Պատկերներ չկան' : locale === 'ru' ? 'Нет изображений' : 'No images yet'}
      </div>
    )
  }

  return (
    <>
      <div className="gallery-grid">
        {images.map((img, i) => (
          <img
            key={img.id}
            src={img.image_path}
            alt={getLocalizedField(img as unknown as Record<string, unknown>, 'alt', locale) || ''}
            style={{ cursor: 'pointer', borderRadius: '2px', transition: 'opacity 0.3s' }}
            onClick={() => setLightbox(i)}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          />
        ))}
      </div>

      {lightbox !== null && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.97)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <button onClick={e => { e.stopPropagation(); setLightbox(l => l !== null && l > 0 ? l - 1 : images.length - 1) }}
            style={{ position: 'absolute', left: '2rem', color: 'var(--cream)', background: 'rgba(255,255,255,0.1)', border: 'none', width: '48px', height: '48px', borderRadius: '50%', fontSize: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>

          <img
            src={images[lightbox].image_path}
            alt=""
            style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain' }}
            onClick={e => e.stopPropagation()}
          />

          <button onClick={e => { e.stopPropagation(); setLightbox(l => l !== null && l < images.length - 1 ? l + 1 : 0) }}
            style={{ position: 'absolute', right: '2rem', color: 'var(--cream)', background: 'rgba(255,255,255,0.1)', border: 'none', width: '48px', height: '48px', borderRadius: '50%', fontSize: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>

          <button onClick={() => setLightbox(null)}
            style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: 'var(--cream)', background: 'rgba(255,255,255,0.1)', border: 'none', width: '40px', height: '40px', borderRadius: '50%', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>

          <div style={{ position: 'absolute', bottom: '1.5rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
            {lightbox + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  )
}
