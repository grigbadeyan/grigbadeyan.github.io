import { notFound } from 'next/navigation'
import { locales, type Locale } from '@/lib/i18n'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export async function generateStaticParams() {
  return locales.map(lang => ({ lang }))
}

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  if (!locales.includes(params.lang as Locale)) {
    notFound()
  }
  const locale = params.lang as Locale

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar locale={locale} />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} />
    </div>
  )
}
