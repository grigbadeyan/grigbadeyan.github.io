import { notFound } from 'next/navigation'
import { getDb } from '@/lib/db'
import { type Locale, t, getLocalizedField } from '@/lib/i18n'
import type { Metadata } from 'next'
import RoomGallery from '@/components/RoomGallery'
import Link from 'next/link'

interface Props {
  params: { lang: string; slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.lang as Locale
  const db = getDb()
  const room = db.prepare('SELECT * FROM rooms WHERE slug = ? AND is_active = 1').get(params.slug) as Room | undefined
  if (!room) return { title: 'Not Found' }
  const name = getLocalizedField(room as unknown as Record<string, unknown>, 'name', locale)
  const desc = getLocalizedField(room as unknown as Record<string, unknown>, 'description', locale)
  return {
    title: `${name} | Tsghotner`,
    description: desc?.substring(0, 160),
  }
}

export default function RoomPage({ params }: Props) {
  const locale = params.lang as Locale
  const tr = t(locale)
  const db = getDb()

  const room = db.prepare('SELECT * FROM rooms WHERE slug = ? AND is_active = 1').get(params.slug) as Room | undefined
  if (!room) notFound()

  const images = db.prepare('SELECT * FROM room_images WHERE room_id = ? ORDER BY sort_order ASC').all(room.id) as RoomImage[]

  const allImages = room.cover_image
    ? [{ id: 0, image_path: room.cover_image, alt_text: '' }, ...images]
    : images

  const name = getLocalizedField(room as unknown as Record<string, unknown>, 'name', locale)
  const description = getLocalizedField(room as unknown as Record<string, unknown>, 'description', locale)
  const features: string[] = JSON.parse(
    getLocalizedField(room as unknown as Record<string, unknown>, 'features', locale) || '[]'
  )

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--dark)' }}>
      {/* Hero */}
      <div style={{ position: 'relative', height: '60vh', overflow: 'hidden', background: '#1a1510' }}>
        {allImages[0] && (
          <img
            src={allImages[0].image_path}
            alt={name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}
          />
        )}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(12,11,9,0.3), rgba(12,11,9,0.8))',
          display: 'flex', alignItems: 'flex-end', padding: '3rem',
        }}>
          <div>
            <Link href={`/${locale}#rooms`} style={{ color: 'var(--gold)', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem', display: 'block' }}>
              ← {tr.rooms}
            </Link>
            <h1 style={{ fontFamily: 'Cormorant Garamond', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 300, color: 'var(--cream)' }}>
              {name}
            </h1>
            {room.price && (
              <div style={{ color: 'var(--gold)', fontFamily: 'Cormorant Garamond', fontSize: '1.3rem', marginTop: '0.5rem' }}>
                {room.price.toLocaleString()} AMD / {tr.perHour}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main */}
          <div style={{ gridColumn: 'span 2' }}>
            <p style={{
              color: 'rgba(245,240,232,0.8)',
              fontSize: '1rem',
              lineHeight: '1.9',
              marginBottom: '3rem',
              fontFamily: locale === 'hy' ? 'Noto Serif Armenian, serif' : 'Raleway, sans-serif',
            }}>
              {description}
            </p>

            {features.length > 0 && (
              <div style={{ marginBottom: '3rem' }}>
                <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.5rem', color: 'var(--gold)', marginBottom: '1.5rem' }}>
                  {tr.features}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
                  {features.map((f, i) => (
                    <div key={i} style={{
                      padding: '0.75rem 1rem',
                      border: '1px solid rgba(212,160,23,0.2)',
                      color: 'var(--cream)',
                      fontSize: '0.85rem',
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                    }}>
                      <span style={{ color: 'var(--gold)' }}>✓</span>
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery */}
            {allImages.length > 1 && <RoomGallery images={allImages} roomName={name} />}
          </div>

          {/* Sidebar */}
          <div>
            <div style={{
              position: 'sticky', top: '100px',
              padding: '2rem',
              border: '1px solid rgba(212,160,23,0.25)',
              background: 'var(--dark-2)',
            }}>
              <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.5rem', color: 'var(--cream)', marginBottom: '1.5rem' }}>
                {tr.bookNow}
              </h3>

              {room.price && (
                <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(212,160,23,0.15)' }}>
                  <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '2rem', color: 'var(--gold)' }}>
                    {room.price.toLocaleString()}
                    <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}> AMD/{tr.perHour}</span>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {room.capacity && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{tr.capacity}</span>
                    <span style={{ color: 'var(--cream)', fontSize: '0.85rem' }}>{room.capacity}</span>
                  </div>
                )}
                {room.area && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{tr.area}</span>
                    <span style={{ color: 'var(--cream)', fontSize: '0.85rem' }}>{room.area} м²</span>
                  </div>
                )}
              </div>

              <Link href={`/${locale}#reservation`} className="btn-gold" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', width: '100%' }}>
                {tr.bookNow}
              </Link>

              <div style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                📞 010 57 00 20
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface Room {
  id: number
  slug: string
  name_hy: string; name_ru: string; name_en: string
  description_hy: string; description_ru: string; description_en: string
  features_hy: string; features_ru: string; features_en: string
  price: number
  cover_image: string
  capacity: number
  area: number
}

interface RoomImage {
  id: number
  image_path: string
  alt_text: string
}
