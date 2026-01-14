'use client';

import { useEffect, useState } from 'react';
import PageLayout from '../../components/PageLayout';
import ItemCard from '../../components/ItemCard';
import styles from '../../styles/ItemGrid.module.css';

interface ObjectItem {
    id: string;
    pt: string;
    en: string;
    es: string;
    color: string;
    borderColor: string;
    textColor?: string;
}

export default function ObjectsPage() {
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

    const playSound = (item: any) => {
        // 1. Tenta áudio do banco (se houver url salva)
        if (item.audioPt || item.audioUrlPt) {
            const audio = new Audio(item.audioPt || item.audioUrlPt);
            audio.play().catch(e => console.log('Audio URL fail:', e));
            return;
        }

        // 2. Tenta áudio local (arquivo físico)
        // Lógica legada para objetos: id + "_" (ex: ball_.mp3)
        // Lógica nova: identifier (ex: ball)

        let audioPath = '';
        if (item.identifier) {
            // Novos itens usam identifier
            audioPath = `/audio/pt/objects/${item.identifier}.mp3`;
        } else {
            // Legado: id + "_"
            audioPath = `/audio/pt/objects/${item.id}_.mp3`;
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
                    {objects.map((item: any) => (
                        <ItemCard
                            key={item.id}
                            title={item.namePt || item.pt}
                            imageSource={item.imageUrl || `/images/objects/${item.id}.png`}
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
