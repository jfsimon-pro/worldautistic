'use client';

import PageLayout from '../../components/PageLayout';
import ActivityCard from '../../components/ActivityCard';
import styles from '../../styles/Activities.module.css';

export default function CommandsMenuPage() {
    return (
        <PageLayout backHref="/home">
            <div className={styles.container}>
                <div className={styles.smallCardsRow}>
                    {/* Ações */}
                    <ActivityCard
                        title="Ações"
                        imageSource="/images/commands/yes.png"
                        backgroundColor="#FFB3B3"
                        borderColor="#E60000"
                        textColor="#800000"
                        href="/actions"
                        smallButton
                    />

                    {/* Animais */}
                    <ActivityCard
                        title="Animais"
                        imageSource="/images/animals.png"
                        backgroundColor="#8ECF99"
                        borderColor="#4E9F62"
                        textColor="#134D2F"
                        href="/animals"
                        smallButton
                    />
                </div>

                <div className={styles.smallCardsRow}>
                    {/* Comida */}
                    <ActivityCard
                        title="Comida"
                        imageSource="/images/food.png"
                        backgroundColor="#E07A5F"
                        borderColor="#9D3C27"
                        textColor="#3F1D14"
                        href="/food"
                        smallButton
                    />

                    {/* Objetos */}
                    <ActivityCard
                        title="Objetos"
                        imageSource="/images/objects.png"
                        backgroundColor="#6A4C93"
                        borderColor="#432C64"
                        textColor="#E0D6F5"
                        href="/objects"
                        smallButton
                    />
                </div>

                <div className={styles.smallCardsRow}>
                    {/* Cores */}
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
