'use client';

import Link from 'next/link';
import PageLayout from '../../components/PageLayout';
import AuthGuard from '../../components/AuthGuard';
import styles from '../../styles/Home.module.css';
import { useTranslation } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';

export default function HomePage() {
    const { t } = useTranslation();
    const { user } = useAuth();


    return (
        <AuthGuard>
            <PageLayout>
                {/* Background Image */}
                <div className={styles['background-container']}>
                    <img
                        src="/images/background.png"
                        alt="Background"
                        className={styles['background-image']}
                    />
                </div>

                {/* Header Logo */}
                <div className={styles['header-logo']}>
                    <img
                        src="/images/logo-small.png"
                        alt="World Autistic"
                        className={styles['logo-small']}
                    />
                    <img
                        src="/images/logonova.png"
                        alt="Puzzle"
                        className={styles['logo-new']}
                    />
                </div>

                {/* Main Content */}
                <div className={styles['main-content']}>

                    {/* Activities Card (Large) */}
                    <Link href="/activities" className={`${styles['home-card']} ${styles['card-large']} ${styles['card-activities']}`}>
                        <div className={styles['card-content']}>
                            <div className={styles['card-title']}>{t('home.activities')}</div>
                        </div>
                        <div className={styles['card-image-wrapper']}>
                            <img src="/images/spaceman-activity.png" alt={t('home.activities')} className={styles['card-image']} />
                        </div>
                    </Link>

                    {/* Commands Card (Large) */}
                    <Link href="/commands" className={`${styles['home-card']} ${styles['card-large']} ${styles['card-commands']}`}>
                        <div className={styles['card-content']}>
                            <div className={styles['card-title']}>{t('home.voiceCommands')}</div>
                        </div>
                        <div className={styles['card-image-wrapper']}>
                            <img src="/images/spaceman-megaphone.png" alt={t('home.voiceCommands')} className={styles['card-image']} />
                        </div>
                    </Link>

                    {/* Frequencies Card (Large) */}
                    <Link href="/frequenciesCategorySelection" className={`${styles['home-card']} ${styles['card-large']} ${styles['card-frequencies']}`}>
                        <div className={styles['card-content']}>
                            <div className={styles['card-title']}>{t('home.soundFrequencies')}</div>
                        </div>
                        <div className={styles['card-image-wrapper']}>
                            <img src="/images/spaceman-music.png" alt={t('home.soundFrequencies')} className={styles['card-image']} />
                        </div>
                    </Link>

                    {/* Small Cards Row - Empty in HTML too */}
                    <div className={styles['small-cards-row']}>
                    </div>

                    {/* Games Card (Large) */}
                    <Link href="/games" className={`${styles['home-card']} ${styles['card-large']} ${styles['card-games']}`}>
                        <div className={styles['card-content']}>
                            <div className={styles['card-title']}>{t('home.games')}</div>
                        </div>
                        <div className={styles['card-image-wrapper']}>
                            <img src="/images/spaceman-game.png" alt={t('home.games')} className={styles['card-image']} />
                        </div>
                    </Link>

                    {/* Ebooks Card (Large) */}
                    <Link href="/ebooks" className={`${styles['home-card']} ${styles['card-large']} ${styles['card-ebooks']}`}>
                        <div className={styles['card-content']}>
                            <div className={styles['card-title']}>{t('home.ebooks')}</div>
                        </div>
                        <div className={styles['card-image-wrapper']}>
                            <img src="/images/spaceman-ebook.png" alt={t('home.ebooks')} className={styles['card-image']} />
                        </div>
                    </Link>

                    {/* Telegram Group Card (Large) */}
                    <a
                        href={user?.hasTelegramAccess
                            ? "https://t.me/+J6ta-zlEMtk0ZThh"
                            : "https://pay.hotmart.com/O84341348Y"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${styles['home-card']} ${styles['card-large']} ${styles['card-telegram']}`}
                    >
                        <div className={styles['card-content']}>
                            <div className={styles['card-title']}>{t('home.telegramGroup')}</div>
                        </div>
                        <div className={styles['card-image-wrapper']}>
                            <img src="/images/spaceman-telegram.png" alt={t('home.telegramGroup')} className={styles['card-image']} />
                        </div>
                    </a>

                </div>
            </PageLayout>
        </AuthGuard>
    );
}
