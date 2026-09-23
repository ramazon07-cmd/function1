import React, { useEffect } from 'react'
import { CalendarDays, Mail, Settings, Trophy, UserRound } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/profile.css'

function initials(name = '') {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'U'
}

export default function Profile() {
  const navigate = useNavigate()
  const { user, loading, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!loading && !isAuthenticated) navigate('/hae', { replace: true })
  }, [loading, isAuthenticated, navigate])

  if (loading || !user) {
    return <main className="profile-page"><div className="profile-shell"><div className="profile-loading">Profil yuklanmoqda...</div></div></main>
  }

  const joined = user.date_joined
    ? new Intl.DateTimeFormat('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(user.date_joined))
    : '—'

  return (
    <main className="profile-page">
      <div className="profile-shell">
        <section className="profile-hero-card">
          <div className="profile-avatar profile-avatar--large">
            {user.profile_image_url ? <img src={user.profile_image_url} alt={user.name || 'Profil rasmi'} /> : <span>{initials(user.name)}</span>}
          </div>
          <div className="profile-identity">
            <span className="profile-eyebrow">Shaxsiy profil</span>
            <h1>{user.name || 'Foydalanuvchi'}</h1>
            <p><Mail size={17} /> {user.email}</p>
          </div>
          <Link className="profile-primary-link" to="/profile/settings"><Settings size={18} /> Sozlamalar</Link>
        </section>

        <section className="profile-grid">
          <article className="profile-info-card">
            <div className="profile-card-icon"><UserRound size={22} /></div>
            <div>
              <span>Ism</span>
              <strong>{user.name || '—'}</strong>
            </div>
          </article>
          <article className="profile-info-card">
            <div className="profile-card-icon"><Mail size={22} /></div>
            <div>
              <span>Email</span>
              <strong>{user.email}</strong>
            </div>
          </article>
          <article className="profile-info-card">
            <div className="profile-card-icon"><CalendarDays size={22} /></div>
            <div>
              <span>Ro‘yxatdan o‘tgan</span>
              <strong>{joined}</strong>
            </div>
          </article>
        </section>

        <section className="profile-actions-card">
          <div>
            <span className="profile-eyebrow">Natijalar</span>
            <h2>Test tarixingizni ko‘ring</h2>
            <p>Oldingi urinishlar, ballar va test natijalari bitta joyda.</p>
          </div>
          <Link className="profile-secondary-link" to="/attempts"><Trophy size={18} /> Natijalarga o‘tish</Link>
        </section>
      </div>
    </main>
  )
}
