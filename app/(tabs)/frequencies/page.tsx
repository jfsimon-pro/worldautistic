'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect, useRef } from 'react';
import PageLayout from '../../components/PageLayout';
import styles from '../../styles/Frequencies.module.css';
import { useTranslation } from '../../context/LanguageContext';

interface Frequency {
    public_id: string;
    secure_url: string;
}

function FrequenciesContent() {
    const { t } = useTranslation();
    const searchParams = useSearchParams();
    const category = searchParams.get('category') || 'relaxationAndSleep';
    const [frequencies, setFrequencies] = useState<Frequency[]>([]);
    const [loading, setLoading] = useState(true);
    const [playingId, setPlayingId] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        async function loadFrequencies() {
            try {
                setLoading(true);
                const response = await fetch(`/api/frequencies?category=${encodeURIComponent(category)}`);
                const data = await response.json();
                setFrequencies(data.resources || []);
            } catch (error) {
                console.error('Erro ao carregar frequências:', error);
                setFrequencies([]);
            } finally {
                setLoading(false);
            }
        }
        loadFrequencies();

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            setPlayingId(null);
        };
    }, [category]);

    const handlePlayPause = (freq: Frequency) => {
        if (playingId === freq.public_id) {
            audioRef.current?.pause();
            setPlayingId(null);
        } else {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            audioRef.current = new Audio(freq.secure_url);
            audioRef.current.loop = true; // Loop infinito
            audioRef.current.play();
            setPlayingId(freq.public_id);

            audioRef.current.onended = () => {
                setPlayingId(null);
            };
        }
    };

    const getTranslatedCategory = (cat: string) => {
        return t(`frequencyCategories.${cat}`) || cat;
    };

    const getTranslatedAudioName = (publicId: string) => {
        // Extrai o nome do arquivo limpo (ex: "deepRelaxation" de "frequencies/deepRelaxation_xyz.mp3")
        const fileName = publicId.split('/').pop() || publicId;
        const cleanName = fileName
            .replace(/\.[^/.]+$/, '')
            .replace(/_[a-z0-9]{6}$/i, '');

        // Tenta traduzir
        const translation = t(`frequencyAudios.${cleanName}`);

        // Se não houver tradução (retorna a chave), formata o nome original
        if (translation === `frequencyAudios.${cleanName}`) {
            return cleanName
                .replace(/_/g, ' ')
                .replace(/([a-z])([A-Z])/g, '$1 $2')
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
        }

        return translation;
    };

    if (loading) {
        return <div className={styles.container}><p>{t('frequencies.loadingFrequencies')}</p></div>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{getTranslatedCategory(category)}</h1>

            {frequencies.length === 0 ? (
                <p className={styles.note}>{t('frequencies.noFrequencies')}</p>
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
                                {getTranslatedAudioName(freq.public_id)}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function FrequenciesPage() {
    const { t } = useTranslation();

    return (
        <PageLayout backHref="/frequenciesCategorySelection">
            <Suspense fallback={<div>{t('common.loading')}</div>}>
                <FrequenciesContent />
            </Suspense>
        </PageLayout>
    );
}
