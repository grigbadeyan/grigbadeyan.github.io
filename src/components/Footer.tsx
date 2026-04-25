import Link from 'next/link'
import { type Locale, t } from '@/lib/i18n'

export default function Footer({ locale }: { locale: Locale }) {
  const tr = t(locale)
  const year = new Date().getFullYear()

  return (
    <footer style={{ borderTop: '1px solid rgba(212,160,23,0.15)', paddingTop: '4rem', paddingBottom: '2rem' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '2rem', color: 'var(--cream)', marginBottom: '0.5rem' }}>
              {locale === 'hy' ? 'Ծղոտներ' : locale === 'ru' ? 'Цхотнер' : 'Tsghotner'}
            </div>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              {tr.siteTagline}
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.8' }}>
              {locale === 'hy' ? 'Անmոռanaltable հangsist Erevani srdi mej' : locale === 'ru' ? 'Незабываемый отдых в сердце Еревана' : 'Unforgettable recreation in the heart of Yerevan'}
            </p>
          </div>

          <div>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              {tr.nav.rooms}
            </div>
            {['Royal', 'Mirage', 'Big Russian', 'Mini Russian', 'Edem', 'Eastern'].map(room => (
              <Link key={room} href={`/${locale}/rooms/${room.toLowerCase().replace(' ', '-')}`} className="footer-link">
                {room}
              </Link>
            ))}
          </div>

          <div>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              {tr.nav.contact}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '2' }}>
              <div>📍 Zavaryan 97, Yerevan</div>
              <div>📞 010 57 00 20</div>
              <div>📞 010 57 00 21</div>
              <div>📞 010 57 00 22</div>
              <div>🕐 24/7</div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(212,160,23,0.1)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            © {year} {locale === 'hy' ? 'Ծղոտներ' : locale === 'ru' ? 'Цхотнер' : 'Tsghotner'}. {tr.footer.rights}.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {(['hy', 'ru', 'en'] as Locale[]).map(l => (
              <Link key={l} href={`/${l}`} style={{ fontSize: '0.75rem', color: l === locale ? 'var(--gold)' : 'var(--text-muted)' }}>
                {l === 'hy' ? 'Հայ' : l === 'ru' ? 'Рус' : 'Eng'}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
