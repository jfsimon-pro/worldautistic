'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from '../../styles/Register.module.css';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminSignInPage() {
    const { language, setLanguage } = useLanguage();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const toggleLanguage = () => {
        const languages: Array<'pt' | 'en' | 'es'> = ['en', 'pt', 'es'];
        const currentIndex = languages.indexOf(language);
        const nextIndex = (currentIndex + 1) % languages.length;
        setLanguage(languages[nextIndex]);
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        console.log('🔵 [ADMIN LOGIN] Iniciando login...');

        if (!email || !password) {
            setError('Email e senha são obrigatórios');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/auth/admin-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro no login');
            }

            console.log('✅ [ADMIN LOGIN] Sucesso! Redirecionando...');
            window.location.href = '/admin';

        } catch (err: any) {
            console.log('💥 [ADMIN LOGIN] Erro:', err);
            setError(err.message || 'Erro desconhecido');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            {/* Background Image */}
            <div className={styles['background-container']}>
                <img
                    src="/images/background.png"
                    alt="Background"
                    className={styles['background-image']}
                />
            </div>

            {/* Language Button (Absolute Top Right) */}
            <div style={{ position: 'absolute', top: '2rem', right: '2rem', zIndex: 10 }}>
                <button onClick={toggleLanguage} className={styles['header-btn']} style={{ background: 'rgba(255, 255, 255, 0.2)', border: 'none', cursor: 'pointer', color: 'white', fontWeight: 'bold' }}>
                    {language.toUpperCase()}
                </button>
            </div>

            {/* Main Content */}
            <div className={styles['main-content']}>

                {/* Logos */}
                <div className={styles['logo-container']}>
                    <img
                        src="/images/logo-small.png"
                        alt="World Autistic Logo"
                        className={styles['logo-small']}
                    />
                </div>

                {/* Blue Card Form */}
                <div className={styles['blue-card']} style={{ borderTop: '4px solid #f59e0b' }}>

                    <div style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'white' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                            🔒 Acesso Administrativo
                        </h2>
                        <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                            Área restrita.
                        </p>
                    </div>

                    <form onSubmit={handleSignIn} >

                        <div className={styles['form-group']}>
                            <label className={styles['form-label']}>Email Admin</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={styles['form-input']}
                                placeholder="admin@worldautistic.com"
                            />
                        </div>

                        <div className={styles['form-group']}>
                            <label className={styles['form-label']}>Senha</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={styles['form-input']}
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Mensagem de erro */}
                        {error && (
                            <div style={{
                                padding: '1rem',
                                marginBottom: '1rem',
                                backgroundColor: '#fee2e2',
                                border: '1px solid #ef4444',
                                borderRadius: '8px',
                                color: '#b91c1c',
                                fontSize: '0.9rem',
                                fontWeight: 500,
                                textAlign: 'left'
                            }}>
                                🚫 {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className={styles['default-btn']}
                            disabled={loading}
                            style={{ opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer', marginTop: '1rem' }}
                        >
                            {loading ? 'Verificando...' : 'Acessar Painel'}
                        </button>

                    </form>

                    <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                        <Link href="/signIn">
                            <span className={styles['checkbox-text']} style={{ fontWeight: 500, textDecoration: 'underline', fontSize: '0.85rem' }}>
                                &larr; Voltar para login de usuários
                            </span>
                        </Link>
                    </div>

                </div>
            </div>

        </div>
    );
}
