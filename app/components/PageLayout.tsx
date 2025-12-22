'use client';

import Link from 'next/link';
import styles from '../styles/PageLayout.module.css';

interface PageLayoutProps {
    children: React.ReactNode;
    backHref?: string;
}

export default function PageLayout({ children, backHref = '/home' }: PageLayoutProps) {
    return (
        <div className={styles.container}>
            {/* Background */}
            <div className={styles['background-container']}>
                <img src="/images/background.png" alt="Background" className={styles['background-image']} />
            </div>

            {/* Header */}
            <div className={styles['header-container']}>
                <Link href={backHref} className={styles['header-btn']}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={styles['header-icon']} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </Link>
            </div>

            {/* Main Content */}
            <div className={styles['main-content']}>
                {children}
            </div>

            {/* Bottom Navigation */}
            <div className={styles['bottom-nav']}>
                <Link href="/home" className={`${styles['nav-item']} ${styles['active']}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={styles['nav-icon']} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                </Link>
                <Link href="/settings" className={styles['nav-item']}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={styles['nav-icon']} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </Link>
            </div>
        </div>
    );
}
