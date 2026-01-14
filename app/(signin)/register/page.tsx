'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from '../../styles/Register.module.css';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validações
    if (!fullName || !email || !confirmEmail || !password) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    if (email !== confirmEmail) {
      setError('Os emails não coincidem');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (!agreeTerms) {
      setError('Você deve aceitar os Termos de Uso');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: fullName,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar conta');
      }

      setSuccess('Conta criada com sucesso! Redirecionando...');

      // Cookies são definidos automaticamente pelo servidor
      // Redirecionar direto para home (já está autenticado)
      setTimeout(() => {
        window.location.href = '/home';
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta. Tente novamente.');
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

      {/* Header Buttons Container */}
      <div className={styles['header-container']}>

        {/* Back Button */}
        <Link href="/(signin)" className={styles['header-btn']}>
          <svg xmlns="http://www.w3.org/2000/svg" className={styles['header-icon']} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>

        {/* Language Button */}
        <button className={styles['header-btn']}>
          <svg xmlns="http://www.w3.org/2000/svg" className={styles['header-icon']} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
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
          <img
            src="/images/puzzle.png"
            alt="Puzzle Piece"
            className={styles['puzzle-piece']}
          />
        </div>

        {/* Blue Card Form */}
        <div className={styles['blue-card']}>

          <form onSubmit={handleRegister} >

            <div className={styles['form-group']}>
              <label className={styles['form-label']}>Nome Completo</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={styles['form-input']}
              />
            </div>

            <div className={styles['form-group']}>
              <label className={styles['form-label']}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles['form-input']}
              />
            </div>

            <div className={styles['form-group']}>
              <label className={styles['form-label']}>Confirmar Email</label>
              <input
                type="email"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                className={styles['form-input']}
              />
            </div>

            <div className={styles['form-group']}>
              <label className={styles['form-label']}>Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles['form-input']}
              />
            </div>

            <label className={styles['checkbox-container']}>
              <input
                type="checkbox"
                className={styles['checkbox-input']}
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <div className={styles['checkbox-custom']}>
                <svg className={styles['checkbox-icon']} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              </div>
              <span className={styles['checkbox-text']}>Aceito os Termos de Uso</span>
            </label>

            {/* Mensagens de erro e sucesso */}
            {error && (
              <div style={{
                padding: '1rem',
                marginBottom: '1rem',
                backgroundColor: '#fee',
                border: '1px solid #fcc',
                borderRadius: '8px',
                color: '#c00',
                fontSize: '0.9rem',
              }}>
                {error}
              </div>
            )}

            {success && (
              <div style={{
                padding: '1rem',
                marginBottom: '1rem',
                backgroundColor: '#efe',
                border: '1px solid #cfc',
                borderRadius: '8px',
                color: '#0a0',
                fontSize: '0.9rem',
              }}>
                {success}
              </div>
            )}

            <button
              type="submit"
              className={styles['default-btn']}
              disabled={loading}
              style={{ opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Criando conta...' : 'Cadastrar'}
            </button>

          </form>

        </div>
      </div>

    </div>
  );
}

