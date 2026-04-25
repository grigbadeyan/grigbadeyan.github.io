'use client'

import { useState, useEffect } from 'react'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({ phone1: '', phone2: '', phone3: '', address: '', email: '', facebook: '', instagram: '' })
  const [password, setPassword] = useState({ current: '', newPass: '', confirm: '' })
  const [msg, setMsg] = useState('')
  const [pwMsg, setPwMsg] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/admin/settings').then(r => r.json()).then(d => {
      if (d && typeof d === 'object') setSettings(prev => ({ ...prev, ...d }))
    })
  }, [])

  const saveSettings = async () => {
    setSaving(true); setMsg('')
    const res = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    })
    setMsg(res.ok ? 'Settings saved!' : 'Error saving')
    setSaving(false)
  }

  const changePassword = async () => {
    if (password.newPass !== password.confirm) { setPwMsg('Passwords do not match'); return }
    if (password.newPass.length < 6) { setPwMsg('Password must be at least 6 characters'); return }
    const res = await fetch('/api/admin/settings/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current: password.current, newPassword: password.newPass }),
    })
    const d = await res.json()
    setPwMsg(res.ok ? 'Password changed!' : (d.error || 'Error'))
    if (res.ok) setPassword({ current: '', newPass: '', confirm: '' })
  }

  const inp: React.CSSProperties = { width: '100%', padding: '0.65rem 0.875rem', background: '#0f1117', border: '1px solid #2d3147', borderRadius: '6px', color: '#f1f5f9', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }
  const lbl: React.CSSProperties = { display: 'block', color: '#94a3b8', fontSize: '0.72rem', marginBottom: '0.4rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }

  return (
    <div style={{ maxWidth: '700px' }}>
      <h1 style={{ color: '#f1f5f9', fontSize: '1.4rem', fontWeight: 600, marginBottom: '0.5rem' }}>Settings</h1>
      <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '2rem' }}>Manage site-wide settings</p>

      {/* Contact info */}
      <div style={{ background: '#1a1d27', border: '1px solid #2d3147', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ color: '#e2e8f0', fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem' }}>📞 Contact Information</h2>

        {msg && <div style={{ padding: '0.65rem 1rem', background: msg.includes('!') ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${msg.includes('!') ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`, borderRadius: '6px', color: msg.includes('!') ? '#22c55e' : '#f87171', marginBottom: '1rem', fontSize: '0.85rem' }}>{msg}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {[
            ['phone1', 'Phone 1', '010 57 00 20'],
            ['phone2', 'Phone 2', '010 57 00 21'],
            ['phone3', 'Phone 3', '010 57 00 22'],
            ['email', 'Email', 'info@tsghotner.am'],
            ['address', 'Address', 'Zavaryan 97, Yerevan'],
          ].map(([key, label, placeholder]) => (
            <div key={key} style={key === 'address' ? { gridColumn: '1 / -1' } : {}}>
              <label style={lbl}>{label}</label>
              <input
                value={(settings as Record<string, string>)[key] || ''}
                onChange={e => setSettings(s => ({ ...s, [key]: e.target.value }))}
                style={inp}
                placeholder={placeholder}
              />
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
          {[['facebook', 'Facebook URL'], ['instagram', 'Instagram URL']].map(([key, label]) => (
            <div key={key}>
              <label style={lbl}>{label}</label>
              <input value={(settings as Record<string, string>)[key] || ''} onChange={e => setSettings(s => ({ ...s, [key]: e.target.value }))} style={inp} placeholder="https://" />
            </div>
          ))}
        </div>

        <button onClick={saveSettings} disabled={saving} style={{ marginTop: '1.25rem', padding: '0.7rem 1.75rem', background: 'rgba(212,160,23,0.15)', border: '1px solid rgba(212,160,23,0.4)', borderRadius: '8px', color: '#d4a017', cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem' }}>
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {/* Change password */}
      <div style={{ background: '#1a1d27', border: '1px solid #2d3147', borderRadius: '12px', padding: '1.5rem' }}>
        <h2 style={{ color: '#e2e8f0', fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem' }}>🔑 Change Password</h2>

        {pwMsg && <div style={{ padding: '0.65rem 1rem', background: pwMsg.includes('!') ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${pwMsg.includes('!') ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`, borderRadius: '6px', color: pwMsg.includes('!') ? '#22c55e' : '#f87171', marginBottom: '1rem', fontSize: '0.85rem' }}>{pwMsg}</div>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {[
            ['current', 'Current Password', password.current],
            ['newPass', 'New Password', password.newPass],
            ['confirm', 'Confirm New Password', password.confirm],
          ].map(([key, label, val]) => (
            <div key={key}>
              <label style={lbl}>{label}</label>
              <input type="password" value={val} onChange={e => setPassword(p => ({ ...p, [key]: e.target.value }))} style={inp} placeholder="••••••••" />
            </div>
          ))}
        </div>

        <button onClick={changePassword} style={{ marginTop: '1.25rem', padding: '0.7rem 1.75rem', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '8px', color: '#60a5fa', cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem' }}>
          Change Password
        </button>
      </div>
    </div>
  )
}
