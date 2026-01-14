'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect, useRef } from 'react';
import PageLayout from '../../components/PageLayout';
import styles from '../../styles/Frequencies.module.css';
import { getAudioTranslation, getCategoryTranslation } from '../../utils/audioTranslations';

interface Frequency {
    public_id: string;
    secure_url: string;
}

// Função para formatar nomes de áudio
function formatAudioName(publicId: string): string {
    // Pega o nome do arquivo após a última barra
    const fileName = publicId.split('/').pop() || publicId;

    // Tenta obter tradução em português primeiro
    const translation = getAudioTranslation(fileName);

    // Se encontrou tradução, retorna
    if (translation && translation !== fileName) {
        return translation;
    }

    // Caso contrário, formata o nome original
    return fileName
        .replace(/\.[^/.]+$/, '')  // Remove extensão
        .replace(/_[a-z0-9]{6}$/i, '')  // Remove sufixo aleatório
        .replace(/_/g, ' ')  // Remove underscores
        .replace(/([a-z])([A-Z])/g, '$1 $2')  // Adiciona espaço antes de maiúsculas
        .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')  // Separa siglas
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())  // Capitaliza
        .join(' ');
}

function FrequenciesContent() {
    const searchParams = useSearchParams();
    const category = searchParams.get('category') || 'Relaxamento';
    const [frequencies, setFrequencies] = useState<Frequency[]>([]);
    const [loading, setLoading] = useState(true);
    const [playingId, setPlayingId] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        async function loadFrequencies() {
            try {
                setLoading(true);
                console.log('Buscando frequências para categoria:', category);

                // Call local API route instead of Cloudinary directly
                const response = await fetch(`/api/frequencies?category=${encodeURIComponent(category)}`);
                const data = await response.json();

                console.log('Dados recebidos:', data);
                setFrequencies(data.resources || []);
            } catch (error) {
                console.error('Erro ao carregar frequências:', error);
                if (error instanceof Error) {
                    console.error('Error message:', error.message);
                    console.error('Error stack:', error.stack);
                }
                setFrequencies([]);
            } finally {
                setLoading(false);
            }
        }
        loadFrequencies();
    }, [category]);

    const handlePlayPause = (freq: Frequency) => {
        if (playingId === freq.public_id) {
            // Pause
            audioRef.current?.pause();
            setPlayingId(null);
        } else {
            // Play new audio
            if (audioRef.current) {
                audioRef.current.pause();
            }
            audioRef.current = new Audio(freq.secure_url);
            audioRef.current.play();
            setPlayingId(freq.public_id);

            // Reset when audio ends
            audioRef.current.onended = () => {
                setPlayingId(null);
            };
        }
    };

    if (loading) {
        return <div className={styles.container}><p>Carregando frequências...</p></div>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{getCategoryTranslation(category)}</h1>

            {frequencies.length === 0 ? (
                <p className={styles.note}>Nenhuma frequência encontrada para esta categoria.</p>
            ) : (
                <div className={styles.list}>
                    {frequencies.map(freq => (
                        <div
                            key={freq.public_id}
                            className={`${styles.card} ${playingId === freq.public_id ? styles.playing : ''}`}
                            onClick={() => handlePlayPause(freq)}
                        >
                            <div className={styles.icon}>
                                {playingId === freq.public_id ? '⏸' : '▶'}
                            </div>
                            <div className={styles.name}>
                                {formatAudioName(freq.public_id)}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function FrequenciesPage() {
    return (
        <PageLayout backHref="/home">
            <Suspense fallback={<div>Carregando...</div>}>
                <FrequenciesContent />
            </Suspense>
        </PageLayout>
    );
}
