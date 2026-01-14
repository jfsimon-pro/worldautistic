'use client';

import { useEffect, useState } from 'react';
import PageLayout from '../../components/PageLayout';
import ItemCard from '../../components/ItemCard';
import styles from '../../styles/ItemGrid.module.css';

interface Command {
    id: string;
    pt: string;
    en: string;
    es: string;
    color: string;
    borderColor: string;
}

export default function ActionsPage() {
    const [commands, setCommands] = useState<Command[]>([]);

    useEffect(() => {
        fetch('/data/commands.json')
            .then(res => res.json())
            .then(data => setCommands(data))
            .catch(err => console.error('Error loading commands:', err));
    }, []);

    const playSound = (id: string) => {
        // Audio files are capitalized with underscore suffix (e.g., "Let_s_go_.mp3")
        const audioFileName = id.split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join('_');
        const audio = new Audio(`/audio/pt/commands/${audioFileName}_.mp3`);
        audio.play().catch(err => console.log('Audio not available:', err));
    };

    return (
        <PageLayout backHref="/commands">
            <div className={styles.container}>
                <div className={styles.grid}>
                    {commands.map(command => (
                        <ItemCard
                            key={command.id}
                            title={command.pt}
                            imageSource={`/images/commands/${command.id}.png`}
                            backgroundColor={command.color}
                            borderColor={command.borderColor}
                            onPress={() => playSound(command.id)}
                        />
                    ))}
                </div>
            </div>
        </PageLayout>
    );
}
