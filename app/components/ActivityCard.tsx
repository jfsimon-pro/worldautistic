'use client';

import Link from 'next/link';
import styles from '../styles/ActivityCard.module.css';

interface ActivityCardProps {
    title: string;
    imageSource: string;
    backgroundColor: string;
    borderColor: string;
    textColor?: string;
    href: string;
    smallButton?: boolean;
}

export default function ActivityCard({
    title,
    imageSource,
    backgroundColor,
    borderColor,
    textColor = '#6F5300',
    href,
    smallButton = false
}: ActivityCardProps) {
    return (
        <Link
            href={href}
            className={`${styles.card} ${smallButton ? styles.cardSmall : styles.cardLarge}`}
            style={{ backgroundColor, borderColor: borderColor, borderWidth: '4px', borderStyle: 'solid' }}
        >
            <div className={styles['card-content']}>
                <div className={styles['card-title']} style={{ color: textColor }}>{title}</div>
            </div>
            <div className={styles['card-image-wrapper']}>
                <img src={imageSource} alt={title} className={styles['card-image']} />
            </div>
        </Link>
    );
}
