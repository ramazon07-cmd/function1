import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import '../styles/attempts.css'

const SUBJECT_LABELS = {
  math: 'Matematika',
  geo: 'Geometriya',
  geometry: 'Geometriya',
  logic: 'Mantiq',
  mantiq: 'Mantiq',
  economics: 'Iqtisod',
  economy: 'Iqtisod',
  iqtisod: 'Iqtisod',
}

function subjectLabel(slug) {
  const key = String(slug || '').trim().toLowerCase()
  return SUBJECT_LABELS[key] || slug || 'Fan'
}

function safePercentage(attempt) {
  const direct = Number(attempt?.percentage)
  if (Number.isFinite(direct)) return Math.max(0, Math.min(100, direct))

  const score = Number(attempt?.score)
  const total = Number(attempt?.total_questions)
  if (Number.isFinite(score) && Number.isFinite(total) && total > 0) {
    return Math.max(0, Math.min(100, (score / total) * 100))
  }

  return 0
}

function performanceClass(percent) {
  if (percent >= 80) return 'excellent'
  if (percent >= 60) return 'good'
  if (percent >= 40) return 'average'
  return 'needs-work'
}

function formatDate(value) {
  if (!value) return 'Sana mavjud emas'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)

  return new Intl.DateTimeFormat('uz-UZ', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function Attempts() {
  const navigate = useNavigate()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [attempts, setAttempts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (authLoading) return undefined

    if (!isAuthenticated) {
      navigate('/hae', { replace: true })
      return undefined
    }

    let active = true

    api.attempts()
      .then((data) => {
        if (!active) return

        const rows = Array.isArray(data) ? data : data?.results || []
        const sorted = [...rows].sort((a, b) => {
          const aDate = new Date(a.finished_at || a.started_at || 0).getTime()
          const bDate = new Date(b.finished_at || b.started_at || 0).getTime()
          return bDate - aDate
        })

        setAttempts(sorted)
      })
      .catch((err) => {
        if (active) setError(err.message || 'Natijalarni yuklashda xatolik yuz berdi.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [authLoading, isAuthenticated, navigate])

  const stats = useMemo(() => {
    if (!attempts.length) {
      return { total: 0, average: 0, best: 0 }
    }

    const percentages = attempts.map(safePercentage)
    const sum = percentages.reduce((acc, value) => acc + value, 0)

    return {
      total: attempts.length,
      average: sum / attempts.length,
      best: Math.max(...percentages),
    }
  }, [attempts])

  if (loading || authLoading) {
    return (
      <main className="attempts-page attempts-state-page">
        <div className="attempts-state-card">Natijalar yuklanmoqda...</div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="attempts-page attempts-state-page">
        <div className="attempts-state-card attempts-state-card--error">{error}</div>
      </main>
    )
  }

  return (
    <main className="attempts-page">
      <section className="attempts-shell">
        <header className="attempts-header">
          <div>
            <span className="attempts-eyebrow">NATIJALAR</span>
            <h1>Mening test natijalarim</h1>
            <p>Yakunlangan testlaringiz va umumiy ko‘rsatkichlaringiz.</p>
          </div>
        </header>

        <section className="attempts-summary" aria-label="Natijalar statistikasi">
          <article className="attempt-summary-card">
            <span>Jami testlar</span>
            <strong>{stats.total}</strong>
          </article>
          <article className="attempt-summary-card">
            <span>O‘rtacha natija</span>
            <strong>{stats.average.toFixed(stats.average % 1 === 0 ? 0 : 1)}%</strong>
          </article>
          <article className="attempt-summary-card">
            <span>Eng yaxshi natija</span>
            <strong>{stats.best.toFixed(stats.best % 1 === 0 ? 0 : 1)}%</strong>
          </article>
        </section>

        {attempts.length === 0 ? (
          <section className="attempts-empty">
            <div className="attempts-empty-icon">0%</div>
            <h2>Hali natija yo‘q</h2>
            <p>Birinchi testingizni yakunlaganingizdan keyin natija shu yerda ko‘rinadi.</p>
            <button type="button" onClick={() => navigate('/test')}>Testlarni boshlash</button>
          </section>
        ) : (
          <section className="attempts-grid" aria-label="Test natijalari">
            {attempts.map((attempt) => {
              const percent = safePercentage(attempt)
              const statusClass = performanceClass(percent)

              return (
                <article className="attempt-card" key={attempt.id}>
                  <div className="attempt-card-topline">
                    <span className="attempt-subject">{subjectLabel(attempt.subject_slug)}</span>
                    <time dateTime={attempt.finished_at || attempt.started_at || undefined}>
                      {formatDate(attempt.finished_at || attempt.started_at)}
                    </time>
                  </div>

                  <h2 className="attempt-title">{attempt.test_title || 'Test natijasi'}</h2>

                  <div className="attempt-score-row">
                    <div className="attempt-score">
                      <strong>{attempt.score}</strong>
                      <span>/ {attempt.total_questions}</span>
                    </div>
                    <span className={`attempt-percent attempt-percent--${statusClass}`}>
                      {percent.toFixed(percent % 1 === 0 ? 0 : 2)}%
                    </span>
                  </div>

                  <div
                    className="attempt-progress"
                    role="progressbar"
                    aria-valuenow={Math.round(percent)}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-label={`${attempt.test_title || 'Test'} natijasi`}
                  >
                    <span
                      className={`attempt-progress-fill attempt-progress-fill--${statusClass}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </article>
              )
            })}
          </section>
        )}
      </section>
    </main>
  )
}

export default Attempts
