'use client';

import { useEffect, useState } from 'react';
import PageLayout from '../../components/PageLayout';
import ItemCard from '../../components/ItemCard';
import styles from '../../styles/ItemGrid.module.css';

interface ColorItem {
    id: string;
    pt: string;
    en: string;
    es: string;
    color: string;
    borderColor: string;
    textColor?: string;
}

export default function ColorsPage() {
    const [colors, setColors] = useState<ColorItem[]>([]);

    useEffect(() => {
        fetch('/data/colors.json')
            .then(res => res.json())
            .then(data => setColors(data))
            .catch(err => console.error('Error loading colors:', err));
    }, []);

    const playSound = (id: string) => {
        // Audio files are lowercase with underscore suffix (e.g., "red_.mp3")
        const audio = new Audio(`/audio/pt/colors/${id}_.mp3`);
        audio.play().catch(err => console.log('Audio not available:', err));
    };

    return (
        <PageLayout backHref="/activities">
            <div className={styles.container}>
                <div className={styles.grid}>
                    {colors.map(item => (
                        <ItemCard
                            key={item.id}
                            title={item.pt}
                            imageSource={`/images/colors/${item.id}.png`}
                            backgroundColor={item.color}
                            borderColor={item.borderColor}
                            textColor={item.textColor}
                            onPress={() => playSound(item.id)}
                        />
                    ))}
                </div>
            </div>
        </PageLayout>
    );
}
