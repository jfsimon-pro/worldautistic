'use client';

import PageLayout from '../../components/PageLayout';
import ActivityCard from '../../components/ActivityCard';
import styles from '../../styles/Activities.module.css';
import { useTranslation } from '../../context/LanguageContext';

export default function ActivitiesPage() {
    const { t } = useTranslation();

    return (
        <PageLayout backHref="/home">
            <div className={styles.container}>
                {/* Numbers - Large */}
                <ActivityCard
                    title={t('activities.numbers')}
                    imageSource="/images/numbers.png"
                    backgroundColor="#AAD3E9"
                    borderColor="#56A9D4"
                    textColor="#090889"
                    href="/numberLevelSelection"
                />

                {/* Letters - Large */}
                <ActivityCard
                    title={t('activities.letters')}
                    imageSource="/images/letters.png"
                    backgroundColor="#F98EB0"
                    borderColor="#F6467f"
                    textColor="#800129"
                    href="/activity?category=lang&level=1"
                />

                {/* Content moved to /commands */}
            </div>
        </PageLayout>
    );
}
