import { getDb } from '@/lib/db'
import { type Locale, t, getLocalizedField } from '@/lib/i18n'
import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: { lang: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.lang as Locale
  const tr = t(locale)
  return {
    title: `${tr.nav.about} | ${tr.siteName}`,
    description: locale === 'en' ? 'Tsghotner sauna-hotel complex in Yerevan' : locale === 'ru' ? 'Сауна-отель комплекс Цхотнер в Ереване' : 'Tsghotner sauna-hotel complex Yerevan',
  }
}

export default function AboutPage({ params }: Props) {
  const locale = params.lang as Locale
  const tr = t(locale)
  const db = getDb()
  const page = db.prepare("SELECT * FROM pages WHERE slug = 'about'").get() as Record<string, unknown> | undefined

  const content = page
    ? getLocalizedField(page, 'content', locale)
    : locale === 'en'
    ? 'Tsghotner sauna-hotel complex is located in the heart of Yerevan, comprising Eastern, Russian and Finnish baths, large pools, Jacuzzi, dance and billiard halls as well as an exquisite restaurant and comfortable suites.'
    : locale === 'ru'
    ? 'Цхотнер — центр отдыха в самом сердце Еревана, включающий восточную, русскую, финскую бани, просторные бассейны, джакузи, ресторан и комфортабельные номера.'
    : '«Ծghоtner» sauna-hyuranoctyin hamalayr Erevanum'

  const features = [
    { icon: '🔥', label: locale === 'en' ? 'Eastern Bath' : locale === 'ru' ? 'Восточная Баня' : 'Areveltyan Baghnik', desc: locale === 'en' ? 'Authentic Turkish hammam experience' : locale === 'ru' ? 'Аутентичный турецкий хамам' : 'Avandakan hamam' },
    { icon: '❄️', label: locale === 'en' ? 'Finnish Sauna' : locale === 'ru' ? 'Финская Сауна' : 'Finnenakan Sauna', desc: locale === 'en' ? 'Traditional Finnish sauna with steam' : locale === 'ru' ? 'Традиционная финская сауна с паром' : 'Avandakan sauna' },
    { icon: '🏊', label: locale === 'en' ? 'Swimming Pools' : locale === 'ru' ? 'Бассейны' : 'Loghavazanner', desc: locale === 'en' ? 'Large pools for relaxation' : locale === 'ru' ? 'Просторные бассейны для отдыха' : 'Yndarpats loghavazanner' },
    { icon: '💆', label: 'SPA & Massage', desc: locale === 'en' ? 'Professional massage and SPA' : locale === 'ru' ? 'Профессиональный массаж и СПА' : 'Merdaragitakan masaj' },
    { icon: '🍽️', label: locale === 'en' ? 'Restaurant' : locale === 'ru' ? 'Ресторан' : 'Restoran', desc: locale === 'en' ? 'Exquisite Armenian and international cuisine' : locale === 'ru' ? 'Изысканная кухня' : 'Entir khohanoc' },
    { icon: '🎱', label: locale === 'en' ? 'Billiards' : locale === 'ru' ? 'Биллиард' : 'Biliard', desc: locale === 'en' ? 'Full-size billiard hall' : locale === 'ru' ? 'Биллиардный зал' : 'Biliardi srahl' },
  ]

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--dark)' }}>
      <div style={{ background: 'var(--dark-2)', padding: '6rem 0 4rem', borderBottom: '1px solid rgba(212,160,23,0.1)' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div style={{ fontSize: '0.65rem', letterSpacing: '0.4em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '1rem' }}>
            {locale === 'hy' ? 'Mer Patmutyun' : locale === 'ru' ? 'Наша История' : 'Our Story'}
          </div>
          <h1 className="section-title text-gold-gradient" style={{ marginBottom: '1.5rem' }}>{tr.about.title}</h1>
          <p style={{ color: 'rgba(245,240,232,0.7)', fontSize: '1.1rem', lineHeight: '1.8', fontFamily: locale === 'hy' ? 'Noto Serif Armenian, serif' : 'Raleway, sans-serif' }}>
            {content}
          </p>
        </div>
      </div>

      <div style={{ padding: '6rem 0' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {features.map(f => (
              <div key={f.label} className="feature-card-lg">
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{f.icon}</div>
                <h3 style={{ color: 'var(--cream)', fontFamily: 'Cormorant Garamond', fontSize: '1.3rem', marginBottom: '0.75rem' }}>{f.label}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: '1.7' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '2rem 0 6rem' }}>
        <Link href={`/${locale}#reservation`} className="btn-gold">{tr.nav.reservation}</Link>
      </div>
    </div>
  )
}
