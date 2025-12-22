'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './styles/Login.module.css';

export default function SignInPage() {
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

      {/* Language Button */}
      <div className={styles['language-btn-container']}>
        <button className={styles['language-btn']}>
          <svg xmlns="http://www.w3.org/2000/svg" className={styles['language-icon']} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

        {/* Blue Card */}
        <div className={styles['blue-card']}>
          <Link href="/(signin)/signIn" className={styles['default-btn']}>
            Ja tenho uma conta
          </Link>
          <Link href="/(signin)/register" className={styles['default-btn']}>
            Criar nova conta
          </Link>
        </div>

        {/* Google Button */}
        <button className={styles['google-btn']}>
          <div className={styles['google-icon-wrapper']}>
            <svg width="24" height="24" viewBox="0 0 1024 1024" style={{ width: '100%', height: '100%' }}>
              <path
                d="M881 442.4H519.7v148.5h206.4c-8.9 48-35.9 88.6-76.6 115.8-34.4 23-78.3 36.6-129.9 36.6-99.9 0-184.4-67.5-214.6-158.2-7.6-23-12-47.6-12-72.9s4.3-49.9 12-72.9c30.3-90.6 114.8-158.1 214.7-158.1 56.3 0 106.8 19.4 146.6 57.4l110-110.1c-66.5-62-153.2-100-256.6-100-149.9 0-279.6 86-342.7 211.4-26 51.8-40.8 110.4-40.8 172.4S15.1 632.8 41.1 684.6c63.1 125.3 192.8 211.3 342.7 211.3 89.6 0 165.1-29.7 220.3-80.2 63-57.4 103.6-141.8 103.6-242.5 0-24.1-2.6-47.3-7.1-69.8z"
                fill="#4285F4"
              />
            </svg>
          </div>
          <span className={styles['google-text']}>Entrar com o google</span>
        </button>

      </div>
    </div>
  );
}

