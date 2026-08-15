import React, { useState } from 'react';
import '../styles/royhat.css';
import BackButton from './BackButton';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Royhat() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.email || !form.password) {
            setError('Email va parol kiriting.');
            return;
        }

        if (form.password.length < 8) {
            setError('Parol kamida 8 ta belgidan iborat bo‘lsin.');
            return;
        }

        try {
            setLoading(true);
            await register(form);
            navigate('/test');
        } catch (err) {
            setError(err.message || 'Ro‘yxatdan o‘tishda xatolik.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className='register_section'>
            <BackButton />

            <div className="register_container">
                <div className="register_left">
                    <span>Online Test Platform</span>
                    <h1>Bilimingizni sinab ko‘ring</h1>
                    <p>
                        Matematika, mantiq va geometriya testlari orqali o‘zingizni rivojlantiring.
                    </p>
                </div>

                <div className="register_right">
                    <h2>Ro‘yxatdan o‘tish</h2>

                    <form onSubmit={handleSubmit}>
                        <input
                            name="name"
                            type="text"
                            placeholder='Ismingiz'
                            value={form.name}
                            onChange={handleChange}
                        />

                        <input
                            name="email"
                            type="email"
                            placeholder='Email'
                            value={form.email}
                            onChange={handleChange}
                        />

                        <input
                            name="password"
                            type="password"
                            placeholder='Parol'
                            value={form.password}
                            onChange={handleChange}
                        />

                        {error && <p style={{ color: 'crimson', marginBottom: 12 }}>{error}</p>}

                        <button disabled={loading}>
                            {loading ? 'Yuborilmoqda...' : 'Davom etish'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default Royhat;
