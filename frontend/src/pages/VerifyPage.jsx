import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './SigninPage.css'; // Reusing signin styles for layout consistency

const VerifyPage = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('Активация вашего аккаунта...');
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const token = searchParams.get('token');

    useEffect(() => {
        const verify = async () => {
            if (!token) {
                setStatus('Токен отсутствует.');
                setError(true);
                return;
            }

            try {
                const response = await fetch(`/api/verify?token=${token}`);
                const data = await response.json();

                if (response.ok) {
                    setStatus(data.message || 'Аккаунт успешно подтвержден!');
                    // Redirect to login after 3 seconds
                    setTimeout(() => {
                        console.log('Navigating to /signin');
                        navigate('/signin');
                    }, 3000);
                } else {
                    setStatus(data.detail || 'Ошибка при подтверждении.');
                    setError(true);
                }
            } catch (err) {
                setStatus('Произошла ошибка при связи с сервером.');
                setError(true);
            }
        };

        verify();
    }, [token, navigate]);

    return (
        <div className="MainPage">
            <Header />
            <main style={{ padding: '100px 20px', textAlign: 'center', minHeight: '60vh' }}>
                <div className="signin-container" style={{ margin: '0 auto', maxWidth: '400px', background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ color: error ? '#ff4d4f' : '#2ecc71', marginBottom: '20px' }}>
                        {error ? 'Ой!' : 'Успех!'}
                    </h2>
                    <p style={{ fontSize: '18px', lineHeight: '1.6', color: '#2c3e50' }}>{status}</p>
                    {!error && (
                        <p style={{ marginTop: '20px', fontSize: '14px', color: '#7f8c8d' }}>
                            Перенаправляем на страницу входа через пару секунд...
                        </p>
                    )}
                    {error && (
                        <button
                            onClick={() => navigate('/signin')}
                            style={{ marginTop: '20px', padding: '10px 20px', background: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                        >
                            Вернуться ко входу
                        </button>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default VerifyPage;
