import { type Locale, t } from '@/lib/i18n'
import HeroSection from '@/components/HeroSection'
import RoomsSection from '@/components/RoomsSection'
import AboutSection from '@/components/AboutSection'
import ReservationSection from '@/components/ReservationSection'
import ContactSection from '@/components/ContactSection'
import { getDb } from '@/lib/db'
import type { Metadata } from 'next'

interface Props {
  params: { lang: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.lang as Locale
  const tr = t(locale)
  return {
    title: `${tr.siteName} | ${tr.siteTagline}`,
    description: tr.hero.description,
    alternates: {
      languages: {
        'hy': '/hy',
        'ru': '/ru',
        'en': '/en',
      }
    }
  }
}

export default async function HomePage({ params }: Props) {
  const locale = params.lang as Locale
  const db = getDb()

  const rooms = db.prepare(`
    SELECT * FROM rooms WHERE is_active = 1 ORDER BY sort_order ASC
  `).all() as Room[]

  const aboutPage = db.prepare(`
    SELECT * FROM pages WHERE slug = 'about'
  `).get() as Page | undefined

  return (
    <div className="page-enter">
      <HeroSection locale={locale} />
      <RoomsSection locale={locale} rooms={rooms} />
      <AboutSection locale={locale} page={aboutPage} />
      <ReservationSection locale={locale} rooms={rooms} />
      <ContactSection locale={locale} />
    </div>
  )
}

interface Room {
  id: number
  slug: string
  name_hy: string
  name_ru: string
  name_en: string
  description_hy: string
  description_ru: string
  description_en: string
  price: number
  cover_image: string
  capacity: number
  area: number
  sort_order: number
}

interface Page {
  id: number
  slug: string
  content_hy: string
  content_ru: string
  content_en: string
  title_hy: string
  title_ru: string
  title_en: string
}
