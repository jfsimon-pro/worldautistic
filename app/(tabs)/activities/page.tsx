'use client';

import PageLayout from '../../components/PageLayout';
import ActivityCard from '../../components/ActivityCard';
import styles from '../../styles/Activities.module.css';

export default function ActivitiesPage() {
    return (
        <PageLayout backHref="/home">
            <div className={styles.container}>
                {/* Numbers - Large */}
                <ActivityCard
                    title="Números"
                    imageSource="/images/numbers.png"
                    backgroundColor="#AAD3E9"
                    borderColor="#56A9D4"
                    textColor="#090889"
                    href="/numberLevelSelection"
                />

                {/* Letters - Large */}
                <ActivityCard
                    title="Letras"
                    imageSource="/images/letters.png"
                    backgroundColor="#F98EB0"
                    borderColor="#F6467f"
                    textColor="#800129"
                    href="/activity?category=lang&level=1"
                />

                {/* Small cards row */}
                <div className={styles.smallCardsRow}>
                    {/* Animals */}
                    <ActivityCard
                        title="Animais"
                        imageSource="/images/animals.png"
                        backgroundColor="#8ECF99"
                        borderColor="#4E9F62"
                        textColor="#134D2F"
                        href="/animals"
                        smallButton
                    />

                    {/* Food */}
                    <ActivityCard
                        title="Comida"
                        imageSource="/images/food.png"
                        backgroundColor="#E07A5F"
                        borderColor="#9D3C27"
                        textColor="#3F1D14"
                        href="/food"
                        smallButton
                    />
                </div>

                <div className={styles.smallCardsRow}>
                    {/* Objects */}
                    <ActivityCard
                        title="Objetos"
                        imageSource="/images/objects.png"
                        backgroundColor="#6A4C93"
                        borderColor="#432C64"
                        textColor="#E0D6F5"
                        href="/objects"
                        smallButton
                    />

                    {/* Colors */}
                    <ActivityCard
                        title="Cores"
                        imageSource="/images/colors.png"
                        backgroundColor="#D9F99D"
                        borderColor="#A3E635"
                        textColor="#166534"
                        href="/colors"
                        smallButton
                    />
                </div>
            </div>
        </PageLayout>
    );
}
