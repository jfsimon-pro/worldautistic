'use client';

import { useState } from 'react';
import PageLayout from '../../components/PageLayout';
import styles from '../../styles/Settings.module.css';

export default function SettingsPage() {
    const [selectedLanguage, setSelectedLanguage] = useState('pt');

    const handleLanguageChange = (language: string) => {
        setSelectedLanguage(language);
        // TODO: Implement actual language change when i18n is set up
        console.log(`Language changed to: ${language}`);
    };

    const handleLogout = () => {
        // TODO: Implement actual logout functionality
        console.log('Logout clicked');
        // For now, redirect to home
        window.location.href = '/home';
    };

    return (
        <PageLayout backHref="/home">
            <div className={styles.container}>
                <h1 className={styles.title}>Configurações</h1>

                <div className={styles.content}>
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Idioma</h2>
                        <div className={styles.languageButtons}>
                            <button
                                className={`${styles.languageButton} ${selectedLanguage === 'pt' ? styles.active : ''}`}
                                onClick={() => handleLanguageChange('pt')}
                            >
                                PT
                            </button>
                            <button
                                className={`${styles.languageButton} ${selectedLanguage === 'en' ? styles.active : ''}`}
                                onClick={() => handleLanguageChange('en')}
                            >
                                EN
                            </button>
                            <button
                                className={`${styles.languageButton} ${selectedLanguage === 'es' ? styles.active : ''}`}
                                onClick={() => handleLanguageChange('es')}
                            >
                                ES
                            </button>
                        </div>
                    </div>

                    <button className={styles.logoutButton} onClick={handleLogout}>
                        Sair
                    </button>
                </div>
            </div>
        </PageLayout>
    );
}
