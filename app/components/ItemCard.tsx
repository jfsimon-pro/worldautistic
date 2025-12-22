'use client';

import styles from '../styles/ItemCard.module.css';

interface ItemCardProps {
  title: string;
  imageSource: string;
  backgroundColor: string;
  borderColor: string;
  textColor?: string;
  onPress?: () => void;
}

export default function ItemCard({
  title,
  imageSource,
  backgroundColor,
  borderColor,
  textColor = '#333',
  onPress
}: ItemCardProps) {
  return (
    <div
      className={styles.card}
      style={{ backgroundColor, borderColor, borderWidth: '3px', borderStyle: 'solid' }}
      onClick={onPress}
    >
      <div className={styles['image-wrapper']}>
        <img src={imageSource} alt={title} className={styles.image} />
      </div>
      <div className={styles.title} style={{ color: textColor }}>{title}</div>
    </div>
  );
}
