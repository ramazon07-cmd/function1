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
    if (authLoading) return

    if (!isAuthenticated) {
      navigate('/hae')
      return
    }

    let alive = true

    async function loadAttempts() {
      try {
        setLoading(true)
        const data = await api.attempts()
        if (alive) setAttempts(Array.isArray(data) ? data : data?.results || [])
      } catch (err) {
        if (alive) setError(err.message || 'Natijalarni yuklashda xatolik yuz berdi.')
      } finally {
        if (alive) setLoading(false)
      }
    }

    loadAttempts()
    return () => {
      alive = false
    }
  }, [authLoading, isAuthenticated, navigate])

  if (loading || authLoading) {
    return <div className="attempts-page"><h2>Natijalar yuklanmoqda...</h2></div>
  }

  if (error) {
    return <div className="attempts-page"><h2 style={{ color: 'crimson' }}>{error}</h2></div>
  }

  return (
    <main className="attempts-page">
      <div className="attempts-header">
        <span>FUNCTION PLATFORM</span>
        <h1>Mening test natijalarim</h1>
        <p>Backendga yuborilgan barcha attemptlar shu yerda chiqadi.</p>
      </div>

      <div className="attempts-grid">
        {attempts.length === 0 && <p>Hali test ishlanmagan.</p>}

        {attempts.map((attempt) => (
          <div className="attempt-card" key={attempt.id}>
            <h3>{attempt.test_title}</h3>
            <p>Fan: {attempt.subject_slug}</p>
            <h2>{attempt.score} / {attempt.total_questions}</h2>
            <strong>{attempt.percentage}%</strong>
            <small>{new Date(attempt.started_at).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </main>
  )
}

export default Attempts
