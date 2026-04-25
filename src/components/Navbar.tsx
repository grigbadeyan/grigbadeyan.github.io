'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { type Locale, localeNames, t } from '@/lib/i18n'

export default function Navbar({ locale }: { locale: Locale }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const tr = t(locale)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { href: `/${locale}`, label: tr.nav.home },
    { href: `/${locale}#rooms`, label: tr.nav.rooms },
    { href: `/${locale}/gallery`, label: tr.nav.gallery },
    { href: `/${locale}/about`, label: tr.nav.about },
    { href: `/${locale}/contact`, label: tr.nav.contact },
  ]

  const otherLocales = (['hy', 'ru', 'en'] as Locale[]).filter(l => l !== locale)

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? 'rgba(12,11,9,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(212,160,23,0.2)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-3 group">
          <div className="w-10 h-10 flex items-center justify-center"
            style={{ border: '1px solid rgba(212,160,23,0.5)' }}>
            <span style={{ color: 'var(--gold)', fontFamily: 'Cormorant Garamond', fontSize: '1.2rem', fontWeight: 600 }}>Ծ</span>
          </div>
          <div>
            <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.1rem', letterSpacing: '0.15em', color: 'var(--cream)' }}>
              {locale === 'hy' ? 'Ծղոտներ' : locale === 'ru' ? 'Цхотнер' : 'Tsghotner'}
            </div>
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase' }}>
              {locale === 'hy' ? 'Սաունա-Հյուրանոց' : locale === 'ru' ? 'Сауна-Отель' : 'Sauna Hotel'}
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', transition: 'color 0.3s' }}
              className="hover:text-gold-400"
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right: Language + CTA */}
        <div className="hidden md:flex items-center gap-4">
          {/* Language switcher */}
          <div className="flex items-center gap-2">
            <span style={{ color: 'var(--gold)', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
              {localeNames[locale]}
            </span>
            <span style={{ color: 'rgba(212,160,23,0.3)' }}>|</span>
            {otherLocales.map(l => (
              <Link
                key={l}
                href={`/${l}`}
                style={{ fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--text-muted)', transition: 'color 0.3s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                {localeNames[l]}
              </Link>
            ))}
          </div>
          <Link
            href={`/${locale}#reservation`}
            className="btn-gold"
            style={{ padding: '0.6rem 1.5rem', fontSize: '0.7rem' }}
          >
            {tr.nav.reservation}
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ color: 'var(--gold)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ background: 'rgba(12,11,9,0.98)', borderTop: '1px solid rgba(212,160,23,0.2)', padding: '1.5rem 1.5rem' }}>
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block py-3"
              style={{ fontSize: '0.85rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--cream)', borderBottom: '1px solid rgba(212,160,23,0.1)' }}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-4 pt-4">
            {(['hy', 'ru', 'en'] as Locale[]).map(l => (
              <Link
                key={l}
                href={`/${l}`}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontSize: '0.75rem',
                  color: l === locale ? 'var(--gold)' : 'var(--text-muted)',
                  fontWeight: l === locale ? 600 : 300,
                }}
              >
                {localeNames[l]}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
