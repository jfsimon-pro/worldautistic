'use client';

import Link from 'next/link';
import PageLayout from '../../components/PageLayout';
import styles from '../../styles/Games.module.css';

interface GameCardProps {
    title: string;
    imageSource: string;
    backgroundColor: string;
    borderColor: string;
    href?: string;
    disabled?: boolean;
}

function GameCard({ title, imageSource, backgroundColor, borderColor, href, disabled }: GameCardProps) {
    const cardContent = (
        <div
            className={`${styles.card} ${disabled ? styles.disabled : ''}`}
            style={{ backgroundColor, borderColor, borderWidth: '4px', borderStyle: 'solid' }}
        >
            <div className={styles.imageWrapper}>
                <img src={imageSource} alt={title} className={styles.image} />
            </div>
            <div className={styles.title}>{title}</div>
            {disabled && <div className={styles.soonBadge}>Em breve</div>}
        </div>
    );

    if (disabled || !href) {
        return cardContent;
    }

    return <Link href={href} className={styles.link}>{cardContent}</Link>;
}

export default function GamesPage() {
    return (
        <PageLayout backHref="/home">
            <div className={styles.container}>
                <div className={styles.grid}>
                    <GameCard
                        title="Jogo da Memória"
                        imageSource="/images/memory-game.png"
                        backgroundColor="#EB4335"
                        borderColor="#B22418"
                        href="/memoryGame"
                    />
                    <GameCard
                        title="Jogo 2"
                        imageSource="/images/spaceman-game.png"
                        backgroundColor="#B642DF"
                        borderColor="#682B7D"
                        disabled
                    />
                    <GameCard
                        title="Jogo 3"
                        imageSource="/images/spaceman-game.png"
                        backgroundColor="#F67C41"
                        borderColor="#D76900"
                        disabled
                    />
                    <GameCard
                        title="Jogo 4"
                        imageSource="/images/spaceman-game.png"
                        backgroundColor="#34A853"
                        borderColor="#2B753F"
                        disabled
                    />
                </div>
            </div>
        </PageLayout>
    );
}
