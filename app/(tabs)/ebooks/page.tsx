'use client';

import PageLayout from '../../components/PageLayout';
import AuthGuard from '../../components/AuthGuard';
import styles from '../../styles/Ebooks.module.css';
import { useTranslation } from '../../context/LanguageContext';
import Link from 'next/link';

export default function EbooksPage() {
    const { t } = useTranslation();

    const ebooks = [
        {
            key: 'manual',
            style: styles['card-manual'],
            icon: '/images/book-icon.png' // Utilizing a generic icon for now or I can reuse spaceman if available
        },
        {
            key: 'guide',
            style: styles['card-guide'],
            icon: '/images/book-icon.png'
        },
        {
            key: 'bcaa',
            style: styles['card-bcaa'],
            icon: '/images/pill-icon.png' // Placeholder, will check if specific icons exist or use generic
        },
        {
            key: 'calming',
            style: styles['card-calming'],
            icon: '/images/heart-icon.png' // Placeholder
        }
    ];

    // Using the spaceman images from home as fallbacks if specific icons aren't available yet, 
    // or just hiding the icon if not present. 
    // The user showed a print with specific icons (spaceman reading, megaphone, etc) for the HOME page, 
    // but for the new page the user said "see the print example" but the print example WAS the home page 
    // (or looked like it, wait, let me re-read the prompt).
    // Prompt: "veja o print de exemplo , na tela deve ter essas opcaoes coloridas igual ao print"
    // The print shows "Activities", "Voice Commands", "Sound Frequencies".
    // Wait, the print shows the HOME page structure: Yellow, Red, Orange.
    // The user wants the Ebooks page to look "based on the layout of the rest of the app" 
    // and have "options colored like the print".
    // So basically a list of large cards.

    return (
        <AuthGuard>
            <PageLayout backHref="/home">
                <div className={styles.container}>
                    <a href="/ebooks/Food Selectivity Manual_.pdf" target="_blank" rel="noopener noreferrer" className={`${styles['ebook-card']} ${styles['card-manual']}`}>
                        <span>{t('ebooks.foodSelectivity')}</span>
                    </a>

                    <a href="/ebooks/Guide to Autism_.pdf" target="_blank" rel="noopener noreferrer" className={`${styles['ebook-card']} ${styles['card-guide']}`}>
                        <span>{t('ebooks.guideToAutism')}</span>
                    </a>

                    <a href="/ebooks/BCAA Regulator.pdf" target="_blank" rel="noopener noreferrer" className={`${styles['ebook-card']} ${styles['card-bcaa']}`}>
                        <span>{t('ebooks.bcaaRegulator')}</span>
                    </a>

                    <a href="/ebooks/Immediate Calming Package.pdf" target="_blank" rel="noopener noreferrer" className={`${styles['ebook-card']} ${styles['card-calming']}`}>
                        <span>{t('ebooks.calmingPackage')}</span>
                    </a>
                </div>
            </PageLayout>
        </AuthGuard>
    );
}
