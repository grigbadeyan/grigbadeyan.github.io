'use client'

import { useState } from 'react'
import { type Locale, t, getLocalizedField } from '@/lib/i18n'

interface Room {
  id: number
  name_hy: string
  name_ru: string
  name_en: string
}

export default function ReservationSection({ locale, rooms }: { locale: Locale; rooms: Room[] }) {
  const tr = t(locale)
  const [form, setForm] = useState({ name: '', phone: '', email: '', room_id: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('success')
        setForm({ name: '', phone: '', email: '', room_id: '', message: '' })
      } else {
        const data = await res.json()
        setErrorMsg(data.error || 'Error')
        setStatus('error')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Network error')
    }
  }

  return (
    <section id="reservation" style={{ padding: '8rem 0', background: 'var(--dark)' }}>
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div style={{ fontSize: '0.65rem', letterSpacing: '0.4em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '1rem' }}>
            {locale === 'hy' ? 'Կապ Հաստատել' : locale === 'ru' ? 'Связаться' : 'Get in Touch'}
          </div>
          <h2 className="section-title text-gold-gradient">{tr.reservation.title}</h2>
        </div>

        {status === 'success' ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            border: '1px solid rgba(212,160,23,0.4)',
            background: 'rgba(212,160,23,0.05)',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
            <p style={{ color: 'var(--gold)', fontFamily: 'Cormorant Garamond', fontSize: '1.3rem' }}>
              {tr.reservation.success}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
          }}>
            <div style={{ gridColumn: '1' }}>
              <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.15em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                {tr.reservation.name} *
              </label>
              <input
                type="text"
                required
                className="form-input"
                placeholder={tr.reservation.name}
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div style={{ gridColumn: '2' }}>
              <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.15em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                {tr.reservation.phone} *
              </label>
              <input
                type="tel"
                required
                className="form-input"
                placeholder="+374 XX XX XX XX"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <div style={{ gridColumn: '1' }}>
              <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.15em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                {tr.reservation.email}
              </label>
              <input
                type="email"
                className="form-input"
                placeholder="email@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div style={{ gridColumn: '2' }}>
              <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.15em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                {tr.reservation.room}
              </label>
              <select
                className="form-input"
                value={form.room_id}
                onChange={e => setForm({ ...form, room_id: e.target.value })}
              >
                <option value="">{tr.reservation.selectRoom}</option>
                {rooms.map(room => (
                  <option key={room.id} value={room.id}>
                    {getLocalizedField(room as unknown as Record<string, unknown>, 'name', locale)}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.15em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                {tr.reservation.message}
              </label>
              <textarea
                className="form-input"
                rows={4}
                placeholder={tr.reservation.message}
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                style={{ resize: 'vertical' }}
              />
            </div>

            {status === 'error' && (
              <div style={{ gridColumn: '1 / -1', color: '#ef4444', fontSize: '0.85rem' }}>
                {errorMsg}
              </div>
            )}

            <div style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn-gold"
                style={{ minWidth: '200px', opacity: status === 'loading' ? 0.7 : 1 }}
              >
                {status === 'loading'
                  ? (locale === 'hy' ? 'Ուղարկվում...' : locale === 'ru' ? 'Отправка...' : 'Sending...')
                  : tr.reservation.send}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
