import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import '../styles/attempts.css'

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
        if (active) setAttempts(Array.isArray(data) ? data : data?.results || [])
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

  if (loading || authLoading) {
    return <main className="attempts-page"><h2>Natijalar yuklanmoqda...</h2></main>
  }

  if (error) {
    return <main className="attempts-page"><h2 style={{ color: 'crimson' }}>{error}</h2></main>
  }

  return (
    <main className="attempts-page">
      <div className="attempts-header">
        <span>FINARIS PLATFORM</span>
        <h1>Mening test natijalarim</h1>
        <p>Yakunlangan testlaringiz va natijalaringiz.</p>
      </div>

      <div className="attempts-grid">
        {attempts.length === 0 ? <p>Hali test ishlanmagan.</p> : null}
        {attempts.map((attempt) => (
          <article className="attempt-card" key={attempt.id}>
            <h3>{attempt.test_title}</h3>
            <p>Fan: {attempt.subject_slug}</p>
            <h2>{attempt.score} / {attempt.total_questions}</h2>
            <strong>{attempt.percentage}%</strong>
            <small>{new Date(attempt.started_at).toLocaleString('uz-UZ')}</small>
          </article>
        ))}
      </div>
    </main>
  )
}

export default Attempts
