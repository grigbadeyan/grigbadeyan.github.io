'use client'

import { useState } from 'react'

interface Image {
  id: number
  image_path: string
  alt_text: string
}

export default function RoomGallery({ images, roomName }: { images: Image[]; roomName: string }) {
  const [lightbox, setLightbox] = useState<number | null>(null)

  return (
    <>
      <div className="gallery-grid">
        {images.map((img, i) => (
          <img
            key={img.id}
            src={img.image_path}
            alt={img.alt_text || `${roomName} ${i + 1}`}
            style={{ cursor: 'pointer', transition: 'opacity 0.3s' }}
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
            background: 'rgba(0,0,0,0.95)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox(l => l !== null && l > 0 ? l - 1 : images.length - 1) }}
            style={{ position: 'absolute', left: '2rem', color: 'white', background: 'none', border: 'none', fontSize: '2rem', cursor: 'pointer' }}
          >
            ‹
          </button>
          <img
            src={images[lightbox].image_path}
            alt={images[lightbox].alt_text}
            style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain' }}
            onClick={e => e.stopPropagation()}
          />
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox(l => l !== null && l < images.length - 1 ? l + 1 : 0) }}
            style={{ position: 'absolute', right: '2rem', color: 'white', background: 'none', border: 'none', fontSize: '2rem', cursor: 'pointer' }}
          >
            ›
          </button>
          <button
            onClick={() => setLightbox(null)}
            style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'white', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
          >
            ✕
          </button>
          <div style={{ position: 'absolute', bottom: '1rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
            {lightbox + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  )
}
