'use client';

import { useEffect, useState } from "react";
import { useActivityContext } from "../ActivityContext";
import { useLanguage } from "../../context/LanguageContext";

import styles from './ActivityStyles.module.css';

// Map numbers to audio file names
const numberToAudioFile: Record<number, string> = {
    1: 'One_',
    2: 'Two_',
    3: 'Three_',
    4: 'Four_',
    5: 'Five_',
    6: 'Six_',
    7: 'Seven_',
    8: 'Eight_',
};

function createMath01() {
    const correctAnswer = Math.floor(Math.random() * 8) + 1;
    const numbers = [correctAnswer];

    while (numbers.length < 4) {
        const randomNum = Math.floor(Math.random() * 8) + 1;
        if (!numbers.includes(randomNum)) {
            numbers.push(randomNum);
        }
    }

    // Shuffle
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    return {
        numbers,
        answer: correctAnswer,
    };
}

export default function MATH01() {
    const { setResult } = useActivityContext();
    const { language, t } = useLanguage();
    const [activity] = useState(createMath01());
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasPlayedOnce, setHasPlayedOnce] = useState(false);

    const playSound = () => {
        setIsPlaying(true);
        const audioFileName = numberToAudioFile[activity.answer];
        const audio = new Audio(`/audio/${language}/numbers/${audioFileName}.mp3`);
        audio.volume = 0.5;

        audio.play()
            .then(() => {
                setHasPlayedOnce(true);
                setTimeout(() => setIsPlaying(false), 500);
            })
            .catch((error) => {
                console.error("Error playing sound:", error);
                setIsPlaying(false);
            });
    };

    useEffect(() => {
        // Play automatically when component mounts (after user has interacted with page)
        const timer = setTimeout(() => {
            playSound();
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    const handleAnswer = (number: number) => {
        setResult(number === activity.answer ? "correct" : "incorrect");
    };

    return (
        <div className={styles.container}>
            <button
                className={`${styles.soundButton} ${isPlaying ? styles.soundButtonActive : ''}`}
                onClick={playSound}
            >
                <img src="/images/sound.png" alt="Som" className={styles.soundIcon} />
            </button>

            <p className={styles.instructionText}>{t('activityExercises.whatNumberDidYouHear')}</p>
            <p className={styles.subText}>
                {hasPlayedOnce ? t('activityExercises.tapIconToHearAgain') : t('activityExercises.waitingForAudio')}
            </p>

            <div className={styles.optionsGrid}>
                {activity.numbers.map((number, index) => (
                    <button
                        key={index}
                        className={styles.optionButton}
                        onClick={() => handleAnswer(number)}
                    >
                        {number}
                    </button>
                ))}
            </div>
        </div>
    );
}
