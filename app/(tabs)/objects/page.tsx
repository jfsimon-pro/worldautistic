'use client';

import { useEffect, useState } from 'react';
import PageLayout from '../../components/PageLayout';
import ItemCard from '../../components/ItemCard';
import styles from '../../styles/ItemGrid.module.css';
import { useLanguage } from '../../context/LanguageContext';
import { getLocalizedName, playItemAudio, Language } from '../../utils/i18nHelpers';

export default function ObjectsPage() {
    const { language } = useLanguage();
    const [objects, setObjects] = useState<any[]>([]);

    useEffect(() => {
        const fetchObjects = async () => {
            try {
                // Tenta buscar do banco de dados
                const res = await fetch('/api/content/cards?category=OBJECTS');
                if (res.ok) {
                    const data = await res.json();
                    if (data.length > 0) {
                        setObjects(data);
                        return;
                    }
                }

                // Fallback para arquivo JSON estático
                console.log('Nenhum objeto no banco, usando fallback...');
                fetch('/data/objects.json')
                    .then(res => res.json())
                    .then(data => setObjects(data))
                    .catch(e => console.error(e));

            } catch (error) {
                console.error('Erro ao buscar objetos:', error);
            }
        };

        fetchObjects();
    }, []);

    const handlePress = (item: any) => {
        playItemAudio(item, language as Language, 'objects', 'lowercase');
    };

    return (
        <PageLayout backHref="/home">
            <div className={styles.container}>
                <div className={styles.grid}>
                    {objects.map((item: any) => (
                        <ItemCard
                            key={item.id}
                            title={getLocalizedName(item, language as Language)}
                            imageSource={item.imageUrl || `/images/objects/${item.id}.png`}
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
