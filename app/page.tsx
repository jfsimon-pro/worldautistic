'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './styles/Login.module.css';
import { useLanguage } from './context/LanguageContext';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function SignInPage() {
  const { t, language, setLanguage } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Verificar se o usuário está autenticado
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          // Usuário autenticado, redirecionar para a página apropriada
          if (data.user.role === 'ADMIN') {
            window.location.href = '/admin';
          } else {
            window.location.href = '/home';
          }
        }
      } catch (error) {
        // Usuário não autenticado, continuar na página de login
        console.log('Usuário não autenticado');
      }
    };

    checkAuth();

    // Detectar iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Verificar se já está instalado como PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as any).standalone === true;

    if (isStandalone) {
      // Já está instalado, não mostrar nada
      setShowInstallButton(false);
      setIsIOS(false);
      return;
    }

    // Para Android/Chrome - usar beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallButton(true);
      console.log('✅ PWA Install Prompt captured');
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Fallback para Desktop (Mac/Windows) onde o evento pode não disparar automaticamente
    // ou para navegadores que não suportam o evento (Safari/Firefox) mas suportam PWA
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isDesktop = !/android|iphone|ipad|ipod/.test(userAgent);

    if (isDesktop && !isStandalone) {
      // Mostrar o botão mesmo sem o evento, para instruir instalação manual
      setShowInstallButton(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  // Debug i18n
  useEffect(() => {
    if (showIOSInstructions) {
      console.log('📱 iOS Instructions - Language:', language);
      console.log('📱 Title translation:', t('ios.title'));
    }
  }, [showIOSInstructions, language, t]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Se temos o evento nativo (Chrome/Edge)
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstallButton(false);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback: Mostrar instruções de instalação manual
      // Se for iOS (já tratado pelo isIOS)
      // Se for Desktop (Chrome/Safari)
      alert('Para instalar:\n\nChrome: Clique no ícone de instalar na barra de endereços URL (canto direito).\n\nSafari: Arquivo > Adicionar ao Dock.\n\nEdge: Menu > Apps > Instalar.');
    }
  };

  const handleIOSInstallClick = () => {
    setShowIOSInstructions(true);
  };

  const toggleLanguage = () => {
    const languages: Array<'pt' | 'en' | 'es'> = ['en', 'pt', 'es'];
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex]);
  };

  return (
    <div className={styles.container}>
      {/* ... background ... */}

      {/* Language Button */}
      <div className={styles['language-btn-container']}>
        <button onClick={toggleLanguage} className={styles['language-btn']}>
          {language.toUpperCase()}
          {/* You can keep the icon if you want, or just text */}
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
            src="/images/logonova.png"
            alt="Puzzle"
            className={styles['logo-new']}
          />
        </div>

        {/* Blue Card */}
        <div className={styles['blue-card']}>
          <Link href="/signIn" className={styles['default-btn']}>
            {t('login.haveAccount')}
          </Link>
        </div>

        {/* Install PWA Button - Android/Chrome */}
        {showInstallButton && (
          <button
            onClick={handleInstallClick}
            className={styles['install-btn']}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {t('login.installApp')}
          </button>
        )}

        {/* Install PWA Button - iOS */}
        {isIOS && !showInstallButton && (
          <button
            onClick={handleIOSInstallClick}
            className={styles['install-btn']}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {t('login.installApp')}
          </button>
        )}

      </div>

      {/* iOS Instructions Modal */}
      {showIOSInstructions && (
        <div className={styles['ios-modal-overlay']} onClick={() => setShowIOSInstructions(false)}>
          <div className={styles['ios-modal']} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles['ios-modal-title']}>📱 {t('ios.title')}</h3>
            <div className={styles['ios-steps']}>
              <div className={styles['ios-step']}>
                <span className={styles['ios-step-number']}>1</span>
                <span>{t('ios.step1')} <strong>{t('ios.action1')}</strong></span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
              </div>
              <div className={styles['ios-step']}>
                <span className={styles['ios-step-number']}>2</span>
                <span>{t('ios.step2')} <strong>"{t('ios.action2')}"</strong></span>
              </div>
              <div className={styles['ios-step']}>
                <span className={styles['ios-step-number']}>3</span>
                <span>{t('ios.step3')} <strong>"{t('ios.action3')}"</strong></span>
              </div>
            </div>
            <button
              className={styles['ios-modal-close']}
              onClick={() => setShowIOSInstructions(false)}
            >
              {t('ios.understood')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
