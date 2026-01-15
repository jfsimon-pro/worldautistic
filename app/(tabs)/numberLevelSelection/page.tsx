'use client';

import Link from 'next/link';
import PageLayout from '../../components/PageLayout';
import styles from '../../styles/LevelSelection.module.css';
import { useTranslation } from '../../context/LanguageContext';

export default function NumberLevelSelectionPage() {
    const { t } = useTranslation();

    return (
        <PageLayout backHref="/home">
            <div className={styles.container}>
                <h1 className={styles.title}>{t('levels.selectLevel')}</h1>

                <div className={styles.buttons}>
                    <Link href="/activity?category=math&level=1" className={styles.button}>
                        {t('levels.level1')}
                    </Link>
                    <Link href="/activity?category=math&level=2" className={styles.button}>
                        {t('levels.level2')}
                    </Link>
                    <Link href="/activity?category=math&level=3" className={styles.button}>
                        {t('levels.level3')}
                    </Link>
                </div>
            </div>
        </PageLayout>
    );
}
