'use client';

import { useEffect, useState } from 'react';
import PageLayout from '../../components/PageLayout';
import ItemCard from '../../components/ItemCard';
import styles from '../../styles/ItemGrid.module.css';

interface Animal {
    id: string;
    pt: string;
    en: string;
    es: string;
    color: string;
    borderColor: string;
    textColor?: string;
}

export default function AnimalsPage() {
    const [animals, setAnimals] = useState<Animal[]>([]);

    useEffect(() => {
        fetch('/data/animals.json')
            .then(res => res.json())
            .then(data => setAnimals(data))
            .catch(err => console.error('Error loading animals:', err));
    }, []);

    const playSound = (id: string) => {
        // Audio files are named with underscore suffix (e.g., Cat_.mp3)
        const audioFileName = id.charAt(0).toUpperCase() + id.slice(1);
        const audio = new Audio(`/audio/pt/animals/${audioFileName}_.mp3`);
        audio.play().catch(err => console.log('Audio not available:', err));
    };

    return (
        <PageLayout backHref="/activities">
            <div className={styles.container}>
                <div className={styles.grid}>
                    {animals.map(animal => (
                        <ItemCard
                            key={animal.id}
                            title={animal.pt}
                            imageSource={`/images/animals/${animal.id}.png`}
                            backgroundColor={animal.color}
                            borderColor={animal.borderColor}
                            textColor={animal.textColor}
                            onPress={() => playSound(animal.id)}
                        />
                    ))}
                </div>
            </div>
        </PageLayout>
    );
}
