'use client';

import { useEffect, useState } from 'react';
import PageLayout from '../../components/PageLayout';
import ItemCard from '../../components/ItemCard';
import styles from '../../styles/ItemGrid.module.css';
import { useLanguage } from '../../context/LanguageContext';
import { getLocalizedName, playItemAudio, Language } from '../../utils/i18nHelpers';

export default function AnimalsPage() {
    const { language } = useLanguage();
    const [animals, setAnimals] = useState<any[]>([]);

    useEffect(() => {
        const fetchAnimals = async () => {
            try {
                // Tenta buscar do banco de dados
                const res = await fetch('/api/content/cards?category=ANIMALS');
                if (res.ok) {
                    const data = await res.json();
                    if (data.length > 0) {
                        setAnimals(data);
                        return;
                    }
                }

                // Fallback para arquivo JSON estático
                console.log('Nenhum animal no banco, usando fallback...');
                fetch('/data/animals.json')
                    .then(res => res.json())
                    .then(data => setAnimals(data))
                    .catch(e => console.error(e));

            } catch (error) {
                console.error('Erro ao buscar animais:', error);
            }
        };

        fetchAnimals();
    }, []);

    const handlePress = (item: any) => {
        playItemAudio(item, language as Language, 'animals', 'capitalize');
    };

    return (
        <PageLayout backHref="/home">
            <div className={styles.container}>
                <div className={styles.grid}>
                    {animals.map((item: any) => (
                        <ItemCard
                            key={item.id}
                            title={getLocalizedName(item, language as Language)}
                            imageSource={item.imageUrl || `/images/animals/${item.id}.png`}
                            backgroundColor={item.bgColor || item.color}
                            borderColor={item.borderColor || 'transparent'}
                            textColor={item.textColor}
                            onPress={() => handlePress(item)}
                        />
                    ))}
                </div>
            </div>
        </PageLayout>
    );
}
