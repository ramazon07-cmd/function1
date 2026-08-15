import React, { useState } from 'react'
import '../styles/royhat.css'
import BackButton from './BackButton'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Royhat() {
    const navigate = useNavigate()
    const { register } = useAuth()
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!username.trim() || !email.trim() || !password.trim()) {
            setError('Username, email va parolni to‘ldiring.')
            return
        }

        if (password.length < 8) {
            setError('Parol kamida 8 ta belgi bo‘lsin.')
            return
        }

        try {
            setLoading(true)
            await register({ username: username.trim(), email: email.trim(), password })
            navigate('/test')
        } catch (err) {
            const data = err?.data
            const firstFieldError = data && typeof data === 'object'
                ? Object.values(data).flat?.()[0]
                : null
            setError(firstFieldError || err.message || 'Ro‘yxatdan o‘tishda xatolik yuz berdi.')
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
                    <p>Backenddan qo‘shilgan testlar avtomatik frontendda chiqadi.</p>
                </div>

                <div className="register_right">
                    <h2>Ro‘yxatdan o‘tish</h2>

                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder='Username'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete="username"
                        />

                        <input
                            type="email"
                            placeholder='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                        />

                        <input
                            type="password"
                            placeholder='Parol'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password"
                        />

                        {error && <p style={{ color: 'crimson', margin: '8px 0' }}>{error}</p>}

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
