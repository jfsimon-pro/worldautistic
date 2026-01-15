'use client';

import { useEffect, useState } from 'react';
import PageLayout from '../../components/PageLayout';
import ItemCard from '../../components/ItemCard';
import styles from '../../styles/ItemGrid.module.css';
import { useLanguage } from '../../context/LanguageContext';
import { getLocalizedName, playItemAudio, Language } from '../../utils/i18nHelpers';

export default function FoodPage() {
    const { language } = useLanguage();
    const [food, setFood] = useState<any[]>([]);

    useEffect(() => {
        const fetchFood = async () => {
            try {
                // Tenta buscar do banco de dados
                const res = await fetch('/api/content/cards?category=FOOD');
                if (res.ok) {
                    const data = await res.json();
                    if (data.length > 0) {
                        setFood(data);
                        return;
                    }
                }

                // Fallback para arquivo JSON estático
                console.log('Nenhum alimento no banco, usando fallback...');
                fetch('/data/food.json')
                    .then(res => res.json())
                    .then(data => setFood(data))
                    .catch(e => console.error(e));

            } catch (error) {
                console.error('Erro ao buscar alimentos:', error);
            }
        };

        fetchFood();
    }, []);

    const handlePress = (item: any) => {
        playItemAudio(item, language as Language, 'food', 'capitalize');
    };

    return (
        <PageLayout backHref="/home">
            <div className={styles.container}>
                <div className={styles.grid}>
                    {food.map((item: any) => (
                        <ItemCard
                            key={item.id}
                            title={getLocalizedName(item, language as Language)}
                            imageSource={item.imageUrl || `/images/food/${item.id}.png`}
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
