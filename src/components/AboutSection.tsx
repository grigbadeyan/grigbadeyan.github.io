import { type Locale, t, getLocalizedField } from '@/lib/i18n'

interface Page {
  content_hy: string
  content_ru: string
  content_en: string
  title_hy: string
  title_ru: string
  title_en: string
}

export default function AboutSection({ locale, page }: { locale: Locale; page?: Page }) {
  const tr = t(locale)

  const defaultContent = {
    hy: '«Ծղոտներ» սաունա-հյուրանոցային համալիր- անմոռանալի հանգիստ՝ օգտակար առողջության համար: «Ծղոտներ»-ը հանգստյան կենտրոն է հենց Երևանի սրտում, որն իր մեջ ներառում է արևելյան, ռուսական, ֆիննական բաղնիքներ, ընդարձակ լողավազաններ, ջակուզիներ, բիլիարդի համար նախատեսված սրահներ և պարահրապարակներ, ինչպես նաև ընտիր ռեստորան և հարմարավետ շքեղ հարկաբաժիններ: Մեր հյուրանոցի համարները հաճելիորեն կզարմացնեն նույնիսկ ամենապահանջկոտ հաճախորդներին:',
    ru: '«Цхотнер» — это центр отдыха в самом сердце Еревана, включающий в себя восточную, русскую, финскую бани, просторные бассейны, джакузи, танцевальный и биллиардный залы, а также изысканный ресторан и комфортабельные апартаменты. Номера нашей гостиницы приятно удивят даже самых требовательных клиентов.',
    en: 'Tsghotner is a vast recreational complex, located in the heart of Yerevan and comprising Eastern, Russian and Finnish baths, large pools, Jacuzzi, dance and billiard halls as well as an exquisite restaurant and comfortable suites. The rooms of our hotel will be a pleasant surprise even for the most demanding customers.',
  }

  const content = page
    ? getLocalizedField(page as unknown as Record<string, unknown>, 'content', locale)
    : defaultContent[locale]

  const features = [
    { icon: '🔥', hy: 'Արևելյան Բաղնիք', ru: 'Восточная Баня', en: 'Eastern Bath' },
    { icon: '❄️', hy: 'Ֆիննական Սաունա', ru: 'Финская Сауна', en: 'Finnish Sauna' },
    { icon: '🏊', hy: 'Լողավազան', ru: 'Бассейн', en: 'Pool' },
    { icon: '💆', hy: 'SPA & Մերսում', ru: 'SPA & Массаж', en: 'SPA & Massage' },
    { icon: '🍽️', hy: 'Ռեստորան', ru: 'Ресторан', en: 'Restaurant' },
    { icon: '🎱', hy: 'Բիլիարդ', ru: 'Биллиард', en: 'Billiards' },
  ]

  return (
    <section id="about" style={{ padding: '8rem 0', background: 'var(--dark-2)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — text */}
          <div>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.4em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '1rem' }}>
              {locale === 'hy' ? 'Մեր Պատմությունը' : locale === 'ru' ? 'Наша История' : 'Our Story'}
            </div>
            <h2 className="section-title text-gold-gradient" style={{ marginBottom: '2rem' }}>
              {tr.about.title}
            </h2>
            <div style={{
              width: '60px',
              height: '1px',
              background: 'var(--gold)',
              marginBottom: '2rem',
            }} />
            <p style={{
              color: 'rgba(245,240,232,0.75)',
              fontSize: '0.95rem',
              lineHeight: '1.9',
              marginBottom: '3rem',
              fontFamily: locale === 'hy' ? 'Noto Serif Armenian, serif' : 'Raleway, sans-serif',
            }}>
              {content}
            </p>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
              {[
                { num: '10+', label: locale === 'hy' ? 'Սենյակ' : locale === 'ru' ? 'Номеров' : 'Rooms' },
                { num: '24/7', label: locale === 'hy' ? 'Բաց' : locale === 'ru' ? 'Открыто' : 'Open' },
                { num: '15+', label: locale === 'hy' ? 'Տարի' : locale === 'ru' ? 'Лет' : 'Years' },
              ].map(stat => (
                <div key={stat.num} style={{ textAlign: 'center', padding: '1.5rem', border: '1px solid rgba(212,160,23,0.15)' }}>
                  <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '2.2rem', color: 'var(--gold)', fontWeight: 300 }}>
                    {stat.num}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.25rem' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — features grid */}
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {features.map(f => (
                <div
                  key={f.en}
                  style={{
                    padding: '1.75rem 1.5rem',
                    background: 'var(--dark)',
                    border: '1px solid rgba(212,160,23,0.12)',
                    transition: 'border-color 0.3s, transform 0.3s',
                    cursor: 'default',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.borderColor = 'rgba(212,160,23,0.4)'
                    el.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.borderColor = 'rgba(212,160,23,0.12)'
                    el.style.transform = 'translateY(0)'
                  }}
                >
                  <div style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>{f.icon}</div>
                  <div style={{ color: 'var(--cream)', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
                    {f[locale]}
                  </div>
                </div>
              ))}
            </div>

            {/* Location */}
            <div style={{
              marginTop: '1rem',
              padding: '1.5rem',
              background: 'var(--dark)',
              border: '1px solid rgba(212,160,23,0.12)',
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
            }}>
              <span style={{ fontSize: '1.5rem' }}>📍</span>
              <div>
                <div style={{ color: 'var(--cream)', fontSize: '0.9rem' }}>Zavaryan 97, Yerevan, Armenia</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  010 57 00 20 · 010 57 00 21 · 010 57 00 22
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
