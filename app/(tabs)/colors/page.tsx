'use client';

import { useEffect, useState } from 'react';
import PageLayout from '../../components/PageLayout';
import ItemCard from '../../components/ItemCard';
import styles from '../../styles/ItemGrid.module.css';
import { useLanguage } from '../../context/LanguageContext';
import { getLocalizedName, playItemAudio, Language } from '../../utils/i18nHelpers';

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
    const { language } = useLanguage();
    const [colors, setColors] = useState<ColorItem[]>([]);

    useEffect(() => {
        const fetchColors = async () => {
            try {
                // Tenta buscar do banco de dados
                const res = await fetch('/api/content/cards?category=COLORS');
                if (res.ok) {
                    const data = await res.json();
                    if (data.length > 0) {
                        setColors(data);
                        return;
                    }
                }

                // Fallback para o JSON estático se não tiver nada no banco
                console.log('Nenhuma cor no banco, usando fallback...');
                fetch('/data/colors.json')
                    .then(res => res.json())
                    .then(data => setColors(data))
                    .catch(e => console.error(e));

            } catch (error) {
                console.error('Erro ao buscar cores:', error);
            }
        };

        fetchColors();
    }, []);

    const handlePress = (item: any) => {
        playItemAudio(item, language as Language, 'colors', 'lowercase');
    };

    return (
        <PageLayout backHref="/home">
            <div className={styles.container}>
                <div className={styles.grid}>
                    {colors.map((item: any) => (
                        <ItemCard
                            key={item.id}
                            title={getLocalizedName(item, language as Language)}
                            imageSource={item.imageUrl || `/images/colors/${item.id}.png`}
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
