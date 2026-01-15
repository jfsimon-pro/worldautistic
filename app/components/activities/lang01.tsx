'use client';

import { useEffect, useState } from "react";
import { useActivityContext } from "../ActivityContext";
import { useLanguage } from "../../context/LanguageContext";
import { getLocalizedName, Language, AudioFileFormat } from "../../utils/i18nHelpers";
import styles from './ActivityStyles.module.css';

// Import data
import ANIMALS from '@/public/data/animals.json';
import FOOD from '@/public/data/food.json';
import OBJECTS from '@/public/data/objects.json';

const questionData: Record<string, any[]> = {
    animals: ANIMALS,
    food: FOOD,
    objects: OBJECTS,
};

// Audio format per category
const categoryAudioFormat: Record<string, AudioFileFormat> = {
    animals: 'capitalize',
    food: 'capitalize',
    objects: 'lowercase',
};

const getRandomItem = <T,>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)];
};

const shuffleArray = <T,>(array: T[]): T[] => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const createLang01 = (category: string) => {
    const selectedData = questionData[category];
    const correctItem = getRandomItem(selectedData);

    const options = [correctItem];
    while (options.length < 4) {
        const randomOption = getRandomItem(selectedData);
        if (!options.some((option) => option.id === randomOption.id)) {
            options.push(randomOption);
        }
    }

    return {
        correctItem,
        options: shuffleArray(options),
        category,
    };
};

const getAudioPath = (category: string, id: string, language: string): string => {
    const format = categoryAudioFormat[category] || 'capitalize';

    if (format === 'capitalize') {
        const audioFileName = id.split('_').map((word: string) =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join('_');
        return `/audio/${language}/${category}/${audioFileName}_.mp3`;
    }

    return `/audio/${language}/${category}/${id}_.mp3`;
};

export default function LANG01() {
    const { setResult } = useActivityContext();
    const { language, t } = useLanguage();
    const categories = Object.keys(questionData);
    const category = getRandomItem(categories);
    const [activity] = useState(createLang01(category));
    const [isPlaying, setIsPlaying] = useState(false);

    const playSound = () => {
        setIsPlaying(true);
        const audioPath = getAudioPath(activity.category, activity.correctItem.id, language);
        const audio = new Audio(audioPath);
        audio.volume = 0.5;

        audio.play()
            .then(() => {
                setTimeout(() => setIsPlaying(false), 500);
            })
            .catch((error) => {
                console.error("Error playing sound:", error);
                setIsPlaying(false);
            });
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            playSound();
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    const handleAnswer = (isCorrect: boolean) => {
        setResult(isCorrect ? "correct" : "incorrect");
    };

    return (
        <div className={styles.container}>
            <p className={styles.instructionText}>{t('activityExercises.clickImageYouHeard')}</p>

            <button
                className={`${styles.highlightContainer} ${isPlaying ? styles.pulsing : ''}`}
                onClick={playSound}
            >
                <span className={styles.highlightText}>
                    {getLocalizedName(activity.correctItem, language as Language)}
                </span>
            </button>

            <div className={styles.imageOptionsGrid}>
                {activity.options.map((option: any, index: number) => (
                    <button
                        key={index}
                        className={styles.imageOptionButton}
                        onClick={() => handleAnswer(option.id === activity.correctItem.id)}
                    >
                        <img
                            src={`/images/${activity.category}/${option.id}.png`}
                            alt={getLocalizedName(option, language as Language)}
                            className={styles.optionImage}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
