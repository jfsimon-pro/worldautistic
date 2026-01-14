'use client';

import Link from 'next/link';
import PageLayout from '../../components/PageLayout';
import styles from '../../styles/LevelSelection.module.css';

export default function NumberLevelSelectionPage() {
    return (
        <PageLayout backHref="/home">
            <div className={styles.container}>
                <h1 className={styles.title}>Selecione o Nível</h1>

                <div className={styles.buttons}>
                    <Link href="/activity?category=math&level=1" className={styles.button}>
                        Nível 1
                    </Link>
                    <Link href="/activity?category=math&level=2" className={styles.button}>
                        Nível 2
                    </Link>
                    <Link href="/activity?category=math&level=3" className={styles.button}>
                        Nível 3
                    </Link>
                </div>
            </div>
        </PageLayout>
    );
}
