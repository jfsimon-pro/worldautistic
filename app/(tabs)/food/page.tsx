'use client';

import { useEffect, useState } from 'react';
import PageLayout from '../../components/PageLayout';
import ItemCard from '../../components/ItemCard';
import styles from '../../styles/ItemGrid.module.css';

export default function FoodPage() {
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

    const playSound = (item: any) => {
        // 1. Tenta áudio do banco (se houver url salva)
        if (item.audioPt || item.audioUrlPt) {
            const audio = new Audio(item.audioPt || item.audioUrlPt);
            audio.play().catch(e => console.log('Audio URL fail:', e));
            return;
        }

        // 2. Tenta áudio local (arquivo físico)
        let audioPath = '';
        if (item.identifier) {
            // Novos itens usam identifier (ex: apple)
            audioPath = `/audio/pt/food/${item.identifier}.mp3`;
        } else {
            // Legado: "french_fries" -> "French_fries_.mp3" (Capitalize only first letter of first word? OR map each word?)
            // O código original fazia: id.split('_').map(word => capitalize).join('_')
            const id = item.id;
            const audioFileName = id.split('_')
                .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                .join('_');
            audioPath = `/audio/pt/food/${audioFileName}_.mp3`;
        }

        const audio = new Audio(audioPath);

        audio.play().catch(() => {
            // 3. Fallback para TTS
            console.log('Audio file not found, using TTS for:', item.namePt || item.pt);
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(item.namePt || item.pt);
                utterance.lang = 'pt-BR';
                window.speechSynthesis.speak(utterance);
            }
        });
    };

    return (
        <PageLayout backHref="/activities">
            <div className={styles.container}>
                <div className={styles.grid}>
                    {food.map((item: any) => (
                        <ItemCard
                            key={item.id}
                            title={item.namePt || item.pt}
                            imageSource={item.imageUrl || `/images/food/${item.id}.png`}
                            backgroundColor={item.bgColor || item.color}
                            borderColor={item.borderColor || 'transparent'}
                            textColor={item.textColor}
                            onPress={() => playSound(item)}
                        />
                    ))}
                </div>
            </div>
        </PageLayout>
    );
}
