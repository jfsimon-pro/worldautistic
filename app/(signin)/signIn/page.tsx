'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../../styles/Register.module.css';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      router.push('/(home)');
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

          <form onSubmit={handleSignIn} >

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
              <label className={styles['form-label']}>Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles['form-input']}
              />
            </div>

            <button type="submit" className={styles['default-btn']}>Entrar</button>

          </form>

          <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
            <Link href="/(signin)/register">
              <span className={styles['checkbox-text']} style={{ fontWeight: 500, textDecoration: 'underline' }}>
                Solicitar acesso
              </span>
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}

