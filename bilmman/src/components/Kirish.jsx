import React, { useEffect, useState } from 'react'
import '../styles/kirish.css'
import BackButton from './BackButton'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Kirish() {
    const navigate = useNavigate()
    const { login, isAuthenticated } = useAuth()

    // Signed-in users who land here from a "Boshlash" button go straight to the tests.
    useEffect(() => {
        if (isAuthenticated) navigate('/test', { replace: true })
    }, [isAuthenticated, navigate])
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')

        if (!email.trim() || !password) {
            setError('Email va parolni kiriting.')
            return
        }

        try {
            setLoading(true)
            await login({ email: email.trim().toLowerCase(), password })
            navigate('/test')
        } catch (err) {
            const data = err?.data
            const detail = data?.detail || (Array.isArray(data?.non_field_errors) ? data.non_field_errors[0] : '')
            setError(detail || err.message || 'Email yoki parol noto‘g‘ri.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className='register_section'>
            <BackButton />

            <div className="register_container">
                <div className="register_left">
                    <span>Online Test Platform</span>
                    <h1>Bilimingizni sinab ko‘ring</h1>
                    <p>Matematika, mantiq va geometriya testlari orqali o‘zingizni rivojlantiring.</p>
                </div>

                <div className="register_right">
                    <h2>Kirish</h2>

                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder='Email'
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            autoComplete="email"
                        />

                        <input
                            type="password"
                            placeholder='Parol'
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            autoComplete="current-password"
                        />

                        {error && <p className="auth-form-error">{error}</p>}

                        <button disabled={loading}>
                            {loading ? 'Kirilmoqda...' : 'Davom etish'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default Kirish
