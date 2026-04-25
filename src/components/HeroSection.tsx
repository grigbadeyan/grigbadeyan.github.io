'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { type Locale, t } from '@/lib/i18n'

export default function HeroSection({ locale }: { locale: Locale }) {
  const tr = t(locale)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const parallax = () => {
      if (heroRef.current) {
        const scrolled = window.scrollY
        heroRef.current.style.backgroundPositionY = `${scrolled * 0.4}px`
      }
    }
    window.addEventListener('scroll', parallax)
    return () => window.removeEventListener('scroll', parallax)
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: `
          linear-gradient(to bottom, rgba(12,11,9,0.3) 0%, rgba(12,11,9,0.6) 60%, rgba(12,11,9,1) 100%),
          url('/uploads/hero-bg.jpg') center/cover no-repeat
        `,
        backgroundColor: '#1a1410',
      }}
    >
      {/* Decorative lines */}
      <div className="absolute inset-0 pointer-events-none" style={{ overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '15%', left: '5%',
          width: '1px', height: '40%',
          background: 'linear-gradient(to bottom, transparent, rgba(212,160,23,0.4), transparent)'
        }} />
        <div style={{
          position: 'absolute', top: '15%', right: '5%',
          width: '1px', height: '40%',
          background: 'linear-gradient(to bottom, transparent, rgba(212,160,23,0.4), transparent)'
        }} />
        <div style={{
          position: 'absolute', top: '30px', left: '50%', transform: 'translateX(-50%)',
          height: '1px', width: '200px',
          background: 'linear-gradient(to right, transparent, rgba(212,160,23,0.4), transparent)'
        }} />
      </div>

      {/* Content */}
      <div className="relative text-center px-6 max-w-4xl mx-auto" style={{ paddingTop: '80px' }}>
        {/* Armenian ornament top */}
        <div style={{ marginBottom: '2rem', opacity: 0.6 }}>
          <div style={{ fontSize: '1.5rem', color: 'var(--gold)', letterSpacing: '0.5em' }}>✦ ✦ ✦</div>
        </div>

        {/* Subtitle */}
        <div style={{
          fontSize: '0.7rem',
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          color: 'var(--gold)',
          marginBottom: '1.5rem',
          animation: 'fadeIn 1s ease-out 0.2s both',
        }}>
          {tr.siteTagline}
        </div>

        {/* Main title */}
        <h1
          className="text-gold-gradient font-display"
          style={{
            fontSize: 'clamp(4rem, 12vw, 8rem)',
            fontWeight: 300,
            letterSpacing: '0.08em',
            lineHeight: 1,
            marginBottom: '1.5rem',
            animation: 'slideUp 1s ease-out 0.4s both',
          }}
        >
          {locale === 'hy' ? 'Ծղոտներ' : locale === 'ru' ? 'Цхотнер' : 'Tsghotner'}
        </h1>

        {/* Description */}
        <p style={{
          fontSize: '1.1rem',
          color: 'rgba(245,240,232,0.7)',
          fontWeight: 300,
          letterSpacing: '0.05em',
          marginBottom: '3rem',
          animation: 'fadeIn 1s ease-out 0.8s both',
          fontFamily: locale === 'hy' ? 'Noto Serif Armenian, serif' : 'Raleway, sans-serif',
        }}>
          {tr.hero.description}
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          style={{ animation: 'fadeIn 1s ease-out 1s both' }}>
          <Link href={`/${locale}#reservation`} className="btn-gold" style={{ minWidth: '200px' }}>
            {tr.hero.cta}
          </Link>
          <Link
            href={`/${locale}#rooms`}
            style={{
              padding: '0.875rem 2.5rem',
              border: '1px solid rgba(212,160,23,0.5)',
              color: 'var(--cream)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontSize: '0.8rem',
              transition: 'all 0.3s',
              textDecoration: 'none',
              minWidth: '200px',
              textAlign: 'center',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.borderColor = 'var(--gold)'
              el.style.color = 'var(--gold)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.borderColor = 'rgba(212,160,23,0.5)'
              el.style.color = 'var(--cream)'
            }}
          >
            {tr.hero.explore}
          </Link>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute',
          bottom: '-120px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          animation: 'fadeIn 1s ease-out 1.5s both',
        }}>
          <div style={{ fontSize: '0.6rem', letterSpacing: '0.3em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            {locale === 'hy' ? 'Ոլորել' : locale === 'ru' ? 'Прокрутить' : 'Scroll'}
          </div>
          <div style={{ width: '1px', height: '60px', background: 'linear-gradient(to bottom, var(--gold), transparent)' }} />
        </div>
      </div>
    </section>
  )
}
