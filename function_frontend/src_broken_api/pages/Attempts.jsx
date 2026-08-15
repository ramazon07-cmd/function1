import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { learningApi } from '../api/client';
import { useAuth } from '../context/AuthContext';

function Attempts() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/hae');
      return;
    }

    learningApi
      .attempts()
      .then((data) => setAttempts(Array.isArray(data) ? data : data.results || []))
      .catch((err) => setError(err.message || 'Natijalar yuklanmadi.'))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="box" style={{ padding: '80px 20px' }}>
        <h2>Natijalar yuklanmoqda...</h2>
      </div>
    );
  }

  return (
    <div className="box" style={{ padding: '80px 20px' }}>
      <h1 style={{ marginBottom: 24 }}>Natijalarim</h1>

      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      {!attempts.length ? (
        <p>Hali test ishlamagansiz.</p>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {attempts.map((item) => (
            <div
              key={item.id}
              style={{
                background: '#fff',
                borderRadius: 20,
                padding: 22,
                boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
              }}
            >
              <h2>{item.test_title}</h2>
              <p>Fan: {item.subject_slug}</p>
              <p>Ball: {item.score} / {item.total_questions}</p>
              <p>Foiz: {item.percentage}%</p>
              <p>Sana: {new Date(item.started_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Attempts;
