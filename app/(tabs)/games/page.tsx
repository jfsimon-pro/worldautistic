'use client';

import Link from 'next/link';
import PageLayout from '../../components/PageLayout';
import styles from '../../styles/Games.module.css';
import { useTranslation } from '../../context/LanguageContext';

interface GameCardProps {
    title: string;
    imageSource: string;
    backgroundColor: string;
    borderColor: string;
    href?: string;
    disabled?: boolean;
    comingSoonText?: string;
}

function GameCard({ title, imageSource, backgroundColor, borderColor, href, disabled, comingSoonText }: GameCardProps) {
    const cardContent = (
        <div
            className={`${styles.card} ${disabled ? styles.disabled : ''}`}
            style={{ backgroundColor, borderColor, borderWidth: '4px', borderStyle: 'solid' }}
        >
            <div className={styles.imageWrapper}>
                <img src={imageSource} alt={title} className={styles.image} />
            </div>
            <div className={styles.title}>{title}</div>
            {disabled && <div className={styles.soonBadge}>{comingSoonText}</div>}
        </div>
    );

    if (disabled || !href) {
        return cardContent;
    }

    return <Link href={href} className={styles.link}>{cardContent}</Link>;
}

export default function GamesPage() {
    const { t } = useTranslation();

    return (
        <PageLayout backHref="/home">
            <div className={styles.container}>
                <div className={styles.grid}>
                    <GameCard
                        title={t('games.memoryGame')}
                        imageSource="/images/memory-game.png"
                        backgroundColor="#EB4335"
                        borderColor="#B22418"
                        href="/memoryGame"
                    />
                    <GameCard
                        title={t('games.game2')}
                        imageSource="/images/spaceman-game.png"
                        backgroundColor="#B642DF"
                        borderColor="#682B7D"
                        disabled
                        comingSoonText={t('games.comingSoon')}
                    />
                    <GameCard
                        title={t('games.game3')}
                        imageSource="/images/spaceman-game.png"
                        backgroundColor="#F67C41"
                        borderColor="#D76900"
                        disabled
                        comingSoonText={t('games.comingSoon')}
                    />
                    <GameCard
                        title={t('games.game4')}
                        imageSource="/images/spaceman-game.png"
                        backgroundColor="#34A853"
                        borderColor="#2B753F"
                        disabled
                        comingSoonText={t('games.comingSoon')}
                    />
                </div>
            </div>
        </PageLayout>
    );
}
