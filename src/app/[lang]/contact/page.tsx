import { type Locale, t } from '@/lib/i18n'
import type { Metadata } from 'next'
import ReservationSection from '@/components/ReservationSection'
import { getDb } from '@/lib/db'

interface Props { params: { lang: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.lang as Locale
  const tr = t(locale)
  return { title: `${tr.nav.contact} | ${tr.siteName}` }
}

export default function ContactPage({ params }: Props) {
  const locale = params.lang as Locale
  const tr = t(locale)
  const db = getDb()
  const rooms = db.prepare('SELECT id, name_hy, name_ru, name_en FROM rooms WHERE is_active = 1').all() as Array<{id: number; name_hy: string; name_ru: string; name_en: string}>

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--dark)' }}>
      <div style={{ background: 'var(--dark-2)', padding: '6rem 0 4rem', borderBottom: '1px solid rgba(212,160,23,0.1)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="section-title text-gold-gradient">{tr.contact.title}</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '📍', label: tr.contact.address, value: 'Zavaryan 97, Yerevan, Armenia' },
              { icon: '📞', label: tr.contact.phone, value: '010 57 00 20\n010 57 00 21\n010 57 00 22' },
              { icon: '🕐', label: tr.contact.hours, value: tr.contact.hoursValue },
            ].map(item => (
              <div key={item.label} style={{ textAlign: 'center', padding: '2rem', border: '1px solid rgba(212,160,23,0.15)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{item.icon}</div>
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.15em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{item.label}</div>
                <div style={{ color: 'var(--cream)', fontSize: '0.9rem', whiteSpace: 'pre-line' }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ReservationSection locale={locale} rooms={rooms} />

      {/* Map */}
      <div style={{ padding: '0 0 4rem' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div style={{ border: '1px solid rgba(212,160,23,0.2)', overflow: 'hidden', height: '400px' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d390.0!2d44.531!3d40.180!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDEwJzQ4LjAiTiA0NMKwMzEnNTQuMCJF!5e0!3m2!1sen!2sam!4v1000000&q=Zavaryan+97+Yerevan"
              width="100%" height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
              allowFullScreen loading="lazy" title="Tsghotner"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
