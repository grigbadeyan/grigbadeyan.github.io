import { type Locale, t, getLocalizedField } from '@/lib/i18n'

interface Page {
  content_hy: string; content_ru: string; content_en: string
  title_hy: string; title_ru: string; title_en: string
}

export default function AboutSection({ locale, page }: { locale: Locale; page?: Page }) {
  const tr = t(locale)

  const defaultContent = {
    hy: '«Ծghोtner» sauna-hyuranoctyin hamalayr- anmoghanaltable hangsist Erevani srdi mej. Hangstyam kentron e henv Erevani srtum.',
    ru: '«Цхотнер» — это центр отдыха в самом сердце Еревана, включающий в себя восточную, русскую, финскую бани, просторные бассейны, джакузи, ресторан и комфортабельные апартаменты.',
    en: 'Tsghotner is a vast recreational complex, located in the heart of Yerevan and comprising Eastern, Russian and Finnish baths, large pools, Jacuzzi, dance and billiard halls as well as an exquisite restaurant and comfortable suites.',
  }

  const content = page
    ? getLocalizedField(page as unknown as Record<string, unknown>, 'content', locale)
    : defaultContent[locale]

  const features = [
    { icon: '🔥', hy: 'Արeveltyan Baghnik', ru: 'Восточная Баня', en: 'Eastern Bath' },
    { icon: '❄️', hy: 'Finnenakan Sauna', ru: 'Финская Сауна', en: 'Finnish Sauna' },
    { icon: '🏊', hy: 'Loghavazan', ru: 'Бассейн', en: 'Pool' },
    { icon: '💆', hy: 'SPA & Mersum', ru: 'SPA & Массаж', en: 'SPA & Massage' },
    { icon: '🍽️', hy: 'Restoran', ru: 'Ресторан', en: 'Restaurant' },
    { icon: '🎱', hy: 'Biliard', ru: 'Биллиард', en: 'Billiards' },
  ]

  return (
    <section id="about" style={{ padding: '8rem 0', background: 'var(--dark-2)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.4em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '1rem' }}>
              {locale === 'hy' ? 'Mer Patmutyan' : locale === 'ru' ? 'Наша История' : 'Our Story'}
            </div>
            <h2 className="section-title text-gold-gradient" style={{ marginBottom: '2rem' }}>{tr.about.title}</h2>
            <div style={{ width: '60px', height: '1px', background: 'var(--gold)', marginBottom: '2rem' }} />
            <p style={{ color: 'rgba(245,240,232,0.75)', fontSize: '0.95rem', lineHeight: '1.9', marginBottom: '3rem',
              fontFamily: locale === 'hy' ? 'Noto Serif Armenian, serif' : 'Raleway, sans-serif' }}>
              {content}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
              {[
                { num: '10+', label: locale === 'hy' ? 'Senyak' : locale === 'ru' ? 'Номеров' : 'Rooms' },
                { num: '24/7', label: locale === 'hy' ? 'Bac' : locale === 'ru' ? 'Открыто' : 'Open' },
                { num: '15+', label: locale === 'hy' ? 'Tari' : locale === 'ru' ? 'Лет' : 'Years' },
              ].map(stat => (
                <div key={stat.num} style={{ textAlign: 'center', padding: '1.5rem', border: '1px solid rgba(212,160,23,0.15)' }}>
                  <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '2.2rem', color: 'var(--gold)', fontWeight: 300 }}>{stat.num}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.25rem' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {features.map(f => (
                <div key={f.en} className="feature-card">
                  <div style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>{f.icon}</div>
                  <div style={{ color: 'var(--cream)', fontSize: '0.85rem', letterSpacing: '0.05em' }}>{f[locale]}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '1rem', padding: '1.5rem', background: 'var(--dark)', border: '1px solid rgba(212,160,23,0.12)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span style={{ fontSize: '1.5rem' }}>📍</span>
              <div>
                <div style={{ color: 'var(--cream)', fontSize: '0.9rem' }}>Zavaryan 97, Yerevan, Armenia</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>010 57 00 20 · 010 57 00 21 · 010 57 00 22</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
