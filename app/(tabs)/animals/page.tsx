'use client';

import { useEffect, useState } from 'react';
import PageLayout from '../../components/PageLayout';
import ItemCard from '../../components/ItemCard';
import styles from '../../styles/ItemGrid.module.css';

export default function AnimalsPage() {
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

    const playSound = (item: any) => {
        // 1. Tenta áudio do banco (se houver url salva)
        if (item.audioPt || item.audioUrlPt) {
            const audio = new Audio(item.audioPt || item.audioUrlPt);
            audio.play().catch(e => console.log('Audio URL fail:', e));
            return;
        }

        // 2. Tenta áudio local (arquivo físico)
        // Lógica legada para animais: Capitalize ID + "_" (ex: Cat_.mp3)
        // Lógica nova: identifier (ex: giraffe)

        let audioPath = '';
        if (item.identifier) {
            // Novos itens usam identifier e podem não ter prefixo/sufixo complexo se não forem do legado
            // Mas vamos tentar manter padrão se possível ou apenas tocar o arquivo
            audioPath = `/audio/pt/animals/${item.identifier}.mp3`;
        } else {
            // Legado
            const id = item.id;
            const audioFileName = id.charAt(0).toUpperCase() + id.slice(1);
            audioPath = `/audio/pt/animals/${audioFileName}_.mp3`;
        }

        // Tentativa extra para o caso de ter sido salvo sem extensão no identifier
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
                    {animals.map((item: any) => (
                        <ItemCard
                            key={item.id}
                            title={item.namePt || item.pt}
                            imageSource={item.imageUrl || `/images/animals/${item.id}.png`}
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
