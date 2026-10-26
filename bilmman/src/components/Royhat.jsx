import React, { useEffect, useState } from 'react'
import '../styles/royhat.css'
import BackButton from './BackButton'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Royhat() {
    const navigate = useNavigate()
    const { register, isAuthenticated } = useAuth()

    // Signed-in users who land here from a "Boshlash" button go straight to the tests.
    useEffect(() => {
        if (isAuthenticated) navigate('/test', { replace: true })
    }, [isAuthenticated, navigate])
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')

        if (!name.trim() || !email.trim() || !password) {
            setError('Ism, email va parolni to‘ldiring.')
            return
        }
        if (name.trim().length < 2) {
            setError('Ism kamida 2 ta belgidan iborat bo‘lsin.')
            return
        }
        if (password.length < 8) {
            setError('Parol kamida 8 ta belgi bo‘lsin.')
            return
        }

        try {
            setLoading(true)
            await register({ name: name.trim(), email: email.trim().toLowerCase(), password })
            navigate('/test')
        } catch (err) {
            const data = err?.data
            const firstError = data && typeof data === 'object'
                ? Object.values(data).flat()[0]
                : null
            setError(firstError || err.message || 'Ro‘yxatdan o‘tishda xatolik yuz berdi.')
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
                    <h2>Ro‘yxatdan o‘tish</h2>

                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder='Ismingiz'
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            autoComplete="name"
                        />

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
                            autoComplete="new-password"
                        />

                        {error && <p className="auth-form-error">{error}</p>}

                        <button disabled={loading}>
                            {loading ? 'Yaratilmoqda...' : 'Davom etish'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default Royhat
