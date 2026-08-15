import React, { useState } from 'react'
import '../styles/kirish.css'
import BackButton from './BackButton'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Kirish() {
    const navigate = useNavigate()
    const { login } = useAuth()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')

        if (!username.trim() || !password) {
            setError('Username va parolni kiriting.')
            return
        }

        try {
            setLoading(true)
            await login({ username: username.trim(), password })
            navigate('/test')
        } catch (err) {
            setError(err?.data?.detail || err.message || 'Kirishda xatolik yuz berdi.')
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
                            type="text"
                            placeholder='Username'
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            autoComplete="username"
                        />

                        <input
                            type="password"
                            placeholder='Parol'
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            autoComplete="current-password"
                        />

                        {error && <p style={{ color: 'crimson', margin: '8px 0' }}>{error}</p>}

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
