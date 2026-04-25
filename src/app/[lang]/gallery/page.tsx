import { getDb } from '@/lib/db'
import { type Locale, t } from '@/lib/i18n'
import type { Metadata } from 'next'
import GalleryClient from '@/components/GalleryClient'

interface Props { params: { lang: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.lang as Locale
  const tr = t(locale)
  return { title: `${tr.nav.gallery} | ${tr.siteName}` }
}

export default function GalleryPage({ params }: Props) {
  const locale = params.lang as Locale
  const tr = t(locale)
  const db = getDb()
  const images = db.prepare('SELECT * FROM gallery WHERE is_active = 1 ORDER BY sort_order ASC').all() as Array<{id: number; image_path: string; alt_hy: string; alt_ru: string; alt_en: string}>

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', background: 'var(--dark)', padding: '8rem 0' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div style={{ fontSize: '0.65rem', letterSpacing: '0.4em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '1rem' }}>
            {locale === 'hy' ? 'Լուսանկարներ' : locale === 'ru' ? 'Фотографии' : 'Photos'}
          </div>
          <h1 className="section-title text-gold-gradient">{tr.nav.gallery}</h1>
        </div>
        <GalleryClient images={images} locale={locale} />
      </div>
    </div>
  )
}
