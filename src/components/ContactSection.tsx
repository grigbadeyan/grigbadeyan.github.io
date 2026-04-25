import { type Locale, t } from '@/lib/i18n'

export default function ContactSection({ locale }: { locale: Locale }) {
  const tr = t(locale)

  return (
    <section id="contact" style={{ padding: '6rem 0', background: 'var(--dark-2)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info */}
          <div>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.4em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '1rem' }}>
              {locale === 'hy' ? 'Գտնել Մեզ' : locale === 'ru' ? 'Найти Нас' : 'Find Us'}
            </div>
            <h2 className="section-title text-gold-gradient" style={{ marginBottom: '2.5rem' }}>
              {tr.contact.title}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {[
                { icon: '📍', label: tr.contact.address, value: 'Zavaryan 97, Yerevan, Armenia' },
                { icon: '📞', label: tr.contact.phone, value: '010 57 00 20 · 010 57 00 21 · 010 57 00 22' },
                { icon: '🕐', label: tr.contact.hours, value: tr.contact.hoursValue },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '44px', height: '44px',
                    border: '1px solid rgba(212,160,23,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, fontSize: '1.1rem',
                  }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                      {item.label}
                    </div>
                    <div style={{ color: 'var(--cream)', fontSize: '0.9rem' }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Map embed */}
          <div style={{ position: 'relative' }}>
            <div style={{ border: '1px solid rgba(212,160,23,0.2)', overflow: 'hidden', height: '350px' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3048.0!2d44.5!3d40.18!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDEwJzQ4LjAiTiA0NMKwMzAnMDAuMCJF!5e0!3m2!1sen!2sam!4v1000000000000!5m2!1sen!2sam&q=Zavaryan+97+Yerevan"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                allowFullScreen
                loading="lazy"
                title="Tsghotner Location"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
