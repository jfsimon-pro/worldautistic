'use client';

import { useEffect, useState } from 'react';
import PageLayout from '../../components/PageLayout';
import ItemCard from '../../components/ItemCard';
import styles from '../../styles/ItemGrid.module.css';

interface Food {
    id: string;
    pt: string;
    en: string;
    es: string;
    color: string;
    borderColor: string;
    textColor?: string;
}

export default function FoodPage() {
    const [food, setFood] = useState<Food[]>([]);

    useEffect(() => {
        fetch('/data/food.json')
            .then(res => res.json())
            .then(data => setFood(data))
            .catch(err => console.error('Error loading food:', err));
    }, []);

    const playSound = (id: string) => {
        // Audio files are named with underscore suffix and capitalize each word
        // e.g., "french_fries" -> "French_fries_.mp3"
        const audioFileName = id.split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join('_');
        const audio = new Audio(`/audio/pt/food/${audioFileName}_.mp3`);
        audio.play().catch(err => console.log('Audio not available:', err));
    };

    return (
        <PageLayout backHref="/activities">
            <div className={styles.container}>
                <div className={styles.grid}>
                    {food.map(item => (
                        <ItemCard
                            key={item.id}
                            title={item.pt}
                            imageSource={`/images/food/${item.id}.png`}
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
