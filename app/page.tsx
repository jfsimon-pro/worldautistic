'use client';

import Link from 'next/link';
import styles from './styles/Login.module.css';
import { useTranslation } from './context/LanguageContext';

export default function SignInPage() {
  const { t } = useTranslation();

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
        <Link href="/settings" className={styles['language-btn']}>
          <svg xmlns="http://www.w3.org/2000/svg" className={styles['language-icon']} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            src="/images/puzzle.png"
            alt="Puzzle Piece"
            className={styles['puzzle-piece']}
          />
        </div>

        {/* Blue Card */}
        <div className={styles['blue-card']}>
          <Link href="/signIn" className={styles['default-btn']}>
            {t('login.haveAccount')}
          </Link>
          <Link href="/register" className={styles['default-btn']}>
            {t('login.createAccount')}
          </Link>
        </div>

      </div>
    </div>
  );
}

