'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from '../../styles/Register.module.css';
import { useTranslation } from '../../context/LanguageContext';

export default function SignInPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    console.log('🔵 [LOGIN] Iniciando login...');
    console.log('📧 Email:', email);

    // Validações
    if (!email) {
      console.log('❌ [LOGIN] Validação falhou: email vazio');
      setError(t('signIn.emailRequired'));
      return;
    }

    setLoading(true);
    console.log('⏳ [LOGIN] Loading = true');

    try {
      console.log('📡 [LOGIN] Enviando requisição para /api/auth/login');
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
        }),
      });

      console.log('📥 [LOGIN] Response recebido:', response.status, response.statusText);
      const data = await response.json();
      console.log('📦 [LOGIN] Data:', data);

      if (!response.ok) {
        console.log('❌ [LOGIN] Response não OK:', data.error);
        if (data.details === 'subscription_required') {
          throw new Error('Assinatura necessária. Verifique seu email de compra.');
        }
        throw new Error(data.error || t('signIn.loginError'));
      }

      console.log('✅ [LOGIN] Login bem-sucedido!');
      // Buscar dados do usuário para verificar role
      const userResponse = await fetch('/api/auth/me', {
        credentials: 'include',
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        const isAdmin = userData.user.role === 'ADMIN';

        console.log('🔀 [LOGIN] Redirecionando baseado em role:', userData.user.role);

        // Redirecionar baseado no role
        if (isAdmin) {
          window.location.href = '/admin';
        } else {
          window.location.href = '/home';
        }
      } else {
        // Se falhar, redireciona para home por padrão
        window.location.href = '/home';
      }
    } catch (err: any) {
      console.log('💥 [LOGIN] Erro capturado:', err);
      setError(err.message || t('signIn.loginError'));
    } finally {
      console.log('🏁 [LOGIN] Finally - Loading = false');
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

      {/* Header Buttons Container */}
      <div className={styles['header-container']}>

        {/* Back Button */}
        <Link href="/" className={styles['header-btn']}>
          <svg xmlns="http://www.w3.org/2000/svg" className={styles['header-icon']} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>

        {/* Language Button */}
        <Link href="/settings" className={styles['header-btn']}>
          <svg xmlns="http://www.w3.org/2000/svg" className={styles['header-icon']} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
        </Link>

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
          <img
            src="/images/logonova.png"
            alt="Puzzle"
            className={styles['logo-new']}
          />
        </div>

        {/* Blue Card Form */}
        <div className={styles['blue-card']}>

          <div style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'white' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Acesso de Assinante</h2>
            <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>
              Digite o email usado na compra da Hotmart para entrar.
            </p>
          </div>

          <form onSubmit={handleSignIn} >

            <div className={styles['form-group']}>
              <label className={styles['form-label']}>{t('signIn.email')}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles['form-input']}
                placeholder="exemplo@email.com"
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
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              className={styles['default-btn']}
              disabled={loading}
              style={{ opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer', marginTop: '1rem' }}
            >
              {loading ? 'Verificando...' : 'Entrar Agora'}
            </button>

          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <Link href="/register">
              <span className={styles['checkbox-text']} style={{ fontWeight: 500, textDecoration: 'underline', fontSize: '0.85rem' }}>
                Não tem acesso? Compre agora
              </span>
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}

