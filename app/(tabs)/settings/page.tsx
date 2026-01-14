'use client';

import PageLayout from '../../components/PageLayout';
import styles from '../../styles/Settings.module.css';
import { useLanguage } from '../../context/LanguageContext';

export default function SettingsPage() {
    const { language, setLanguage, t } = useLanguage();

    const handleLogout = () => {
        // TODO: Implement actual logout functionality
        console.log('Logout clicked');
        // For now, redirect to home
        window.location.href = '/home';
    };

    return (
        <PageLayout backHref="/home">
            <div className={styles.container}>
                <h1 className={styles.title}>{t('settings.title')}</h1>

                <div className={styles.content}>
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>{t('settings.language')}</h2>
                        <div className={styles.languageButtons}>
                            <button
                                className={`${styles.languageButton} ${language === 'pt' ? styles.active : ''}`}
                                onClick={() => setLanguage('pt')}
                            >
                                PT
                            </button>
                            <button
                                className={`${styles.languageButton} ${language === 'en' ? styles.active : ''}`}
                                onClick={() => setLanguage('en')}
                            >
                                EN
                            </button>
                            <button
                                className={`${styles.languageButton} ${language === 'es' ? styles.active : ''}`}
                                onClick={() => setLanguage('es')}
                            >
                                ES
                            </button>
                        </div>
                    </div>

                    <button className={styles.logoutButton} onClick={handleLogout}>
                        {t('settings.logout')}
                    </button>
                </div>
            </div>
        </PageLayout>
    );
}
