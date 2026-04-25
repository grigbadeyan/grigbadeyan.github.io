import Link from 'next/link'
import { type Locale, t, getLocalizedField } from '@/lib/i18n'

interface Room {
  id: number
  slug: string
  name_hy: string; name_ru: string; name_en: string
  description_hy: string; description_ru: string; description_en: string
  price: number
  cover_image: string
  capacity: number
  area: number
}

export default function RoomsSection({ locale, rooms }: { locale: Locale; rooms: Room[] }) {
  const tr = t(locale)

  return (
    <section id="rooms" style={{ padding: '8rem 0', background: 'var(--dark)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div style={{ fontSize: '0.65rem', letterSpacing: '0.4em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '1rem' }}>
            {locale === 'hy' ? 'Մեր Համaalиrը' : locale === 'ru' ? 'Наш Комплекс' : 'Our Complex'}
          </div>
          <h2 className="section-title text-gold-gradient">{tr.rooms}</h2>
          <div className="ornament mt-4" style={{ maxWidth: '300px', margin: '1rem auto 0' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--gold)' }}>✦</span>
          </div>
        </div>

        {rooms.length === 0 ? (
          <div className="text-center" style={{ color: 'var(--text-muted)', padding: '4rem' }}>
            {locale === 'hy' ? 'Սenythakner chken' : locale === 'ru' ? 'Нет номеров' : 'No rooms available'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} locale={locale} tr={tr} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function RoomCard({ room, locale, tr }: { room: Room; locale: Locale; tr: ReturnType<typeof t> }) {
  const name = getLocalizedField(room as unknown as Record<string, unknown>, 'name', locale)
  const description = getLocalizedField(room as unknown as Record<string, unknown>, 'description', locale)

  return (
    <Link href={`/${locale}/rooms/${room.slug}`} style={{ textDecoration: 'none' }}>
      <article className="room-card" style={{ background: 'var(--dark-2)', border: '1px solid rgba(212,160,23,0.12)', overflow: 'hidden' }}>
        <div style={{ position: 'relative', height: '240px', overflow: 'hidden', background: '#1a1510' }}>
          {room.cover_image ? (
            <img
              src={room.cover_image}
              alt={name}
              className="room-card-img"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '3rem', opacity: 0.2 }}>🏛</span>
            </div>
          )}
          {room.price && (
            <div style={{
              position: 'absolute', bottom: '1rem', right: '1rem',
              background: 'rgba(12,11,9,0.9)', border: '1px solid rgba(212,160,23,0.4)',
              padding: '0.4rem 0.8rem', backdropFilter: 'blur(10px)',
            }}>
              <span style={{ color: 'var(--gold)', fontFamily: 'Cormorant Garamond', fontSize: '1rem' }}>
                {room.price.toLocaleString()} <span style={{ fontSize: '0.7rem' }}>AMD/{tr.perHour}</span>
              </span>
            </div>
          )}
        </div>

        <div style={{ padding: '1.5rem' }}>
          <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.4rem', fontWeight: 400, color: 'var(--cream)', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
            {name}
          </h3>

          {description && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: '1.7', marginBottom: '1.25rem',
              display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {description}
            </p>
          )}

          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.25rem' }}>
            {room.capacity && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ color: 'var(--gold)', fontSize: '0.75rem' }}>👥</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{room.capacity} {tr.capacity}</span>
              </div>
            )}
            {room.area && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ color: 'var(--gold)', fontSize: '0.75rem' }}>📐</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{room.area} {tr.area}</span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gold)', fontSize: '0.75rem',
            letterSpacing: '0.15em', textTransform: 'uppercase', borderTop: '1px solid rgba(212,160,23,0.15)', paddingTop: '1rem' }}>
            <span>{tr.viewRoom}</span>
            <span style={{ fontSize: '1rem' }}>→</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
