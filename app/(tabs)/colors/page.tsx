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

    const playSound = (item: any) => {
        // 1. Tenta áudio do banco (se houver url salva)
        if (item.audioPt || item.audioUrlPt) {
            const audio = new Audio(item.audioPt || item.audioUrlPt);
            audio.play().catch(e => console.log('Audio URL fail:', e));
            return;
        }

        // 2. Tenta áudio local (arquivo físico)
        // Usa identifier (novo) ou id (antigo)
        // O app original usa id, mas nossas novas cores usam identifier (slug)
        const soundId = item.identifier || item.id;
        const audioPath = `/audio/pt/colors/${soundId}_.mp3`;

        const audio = new Audio(audioPath);

        audio.play().catch(() => {
            // 3. Fallback: Se falhar (arquivo não existe), usa TTS do navegador
            console.log('Audio file not found, using TTS for:', item.namePt || item.pt);

            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(item.namePt || item.pt);
                utterance.lang = 'pt-BR';
                window.speechSynthesis.speak(utterance);
            }
        });
    };

    return (
        <PageLayout backHref="/home">
            <div className={styles.container}>
                <div className={styles.grid}>
                    {colors.map((item: any) => (
                        <ItemCard
                            key={item.id}
                            title={item.namePt || item.pt} // Suporta formato novo e antigo
                            imageSource={item.imageUrl || `/images/colors/${item.id}.png`}
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
