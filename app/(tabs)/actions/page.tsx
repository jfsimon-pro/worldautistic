'use client';

import { useEffect, useState } from 'react';
import PageLayout from '../../components/PageLayout';
import ItemCard from '../../components/ItemCard';
import styles from '../../styles/ItemGrid.module.css';
import { useLanguage } from '../../context/LanguageContext';
import { getLocalizedName, playItemAudio, Language } from '../../utils/i18nHelpers';

interface Command {
    id: string;
    pt: string;
    en: string;
    es: string;
    color: string;
    borderColor: string;
}

export default function ActionsPage() {
    const { language } = useLanguage();
    const [commands, setCommands] = useState<Command[]>([]);

    useEffect(() => {
        fetch('/data/commands.json')
            .then(res => res.json())
            .then(data => setCommands(data))
            .catch(err => console.error('Error loading commands:', err));
    }, []);

    const handlePress = (item: Command) => {
        playItemAudio(item, language as Language, 'commands', 'capitalize');
    };

    return (
        <PageLayout backHref="/home">
            <div className={styles.container}>
                <div className={styles.grid}>
                    {commands.map(command => (
                        <ItemCard
                            key={command.id}
                            title={getLocalizedName(command, language as Language)}
                            imageSource={`/images/commands/${command.id}.png`}
                            backgroundColor={command.color}
                            borderColor={command.borderColor}
                            onPress={() => handlePress(command)}
                        />
                    ))}
                </div>
            </div>
        </PageLayout>
    );
}
