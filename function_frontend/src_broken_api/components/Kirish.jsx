import React, { useState } from 'react';
import '../styles/kirish.css';
import BackButton from './BackButton';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Kirish() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            setLoading(true);
            await login(form);
            navigate('/test');
        } catch (err) {
            setError(err.message || 'Email yoki parol xato.');
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
                    <h2>Kirish</h2>

                    <form onSubmit={handleSubmit}>
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
                            {loading ? 'Tekshirilmoqda...' : 'Davom etish'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default Kirish;
