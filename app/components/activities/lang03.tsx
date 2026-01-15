'use client';

import { useState } from "react";
import { useActivityContext } from "../ActivityContext";
import { useLanguage } from "../../context/LanguageContext";
import { getLocalizedName, Language } from "../../utils/i18nHelpers";
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

const createLang03 = (category: string, language: string) => {
    const selectedData = questionData[category];
    const correctItem = getRandomItem(selectedData);
    const answerWord = getLocalizedName(correctItem, language as Language);
    const wordArray = answerWord.split("");

    const missingCount = Math.random() < 0.5 ? 2 : 3;
    const missingIndices: number[] = [];
    while (missingIndices.length < missingCount && missingIndices.length < wordArray.length) {
        const randomIndex = Math.floor(Math.random() * wordArray.length);
        if (!missingIndices.includes(randomIndex)) {
            missingIndices.push(randomIndex);
        }
    }

    const sequence = wordArray.map((letter: string, index: number) =>
        missingIndices.includes(index) ? "?" : letter
    );

    const correctAnswers = missingIndices
        .map((index) => ({ index, letter: wordArray[index].toLowerCase() }))
        .sort((a, b) => a.index - b.index);

    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const wrongOptions: string[] = [];
    while (wrongOptions.length < 8 - correctAnswers.length) {
        const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
        if (
            !correctAnswers.some((answer) => answer.letter.toLowerCase() === randomLetter) &&
            !wrongOptions.includes(randomLetter)
        ) {
            wrongOptions.push(randomLetter);
        }
    }

    const options = shuffleArray([
        ...correctAnswers.map((answer) => answer.letter),
        ...wrongOptions,
    ]);

    return {
        correctItem,
        sequence,
        options,
        answers: correctAnswers,
        currentStep: 0,
        category,
    };
};

export default function LANG03() {
    const { setResult } = useActivityContext();
    const { language, t } = useLanguage();
    const categories = Object.keys(questionData);
    const category = getRandomItem(categories);
    const [activity, setActivity] = useState(() => createLang03(category, language));
    const [disabledLetters, setDisabledLetters] = useState<number[]>([]);

    const handleAnswer = (selectedLetter: string, index: number) => {
        const { currentStep, answers, sequence } = activity;

        if (selectedLetter.toLowerCase() === answers[currentStep].letter.toLowerCase()) {
            const updatedSequence = [...sequence];
            updatedSequence[answers[currentStep].index] = selectedLetter;

            setDisabledLetters((prev) => [...prev, index]);

            if (currentStep + 1 === answers.length) {
                setResult("correct");
            }

            setActivity({
                ...activity,
                sequence: updatedSequence,
                currentStep: currentStep + 1,
            });
        } else {
            setResult("incorrect");
        }
    };

    return (
        <div className={styles.container}>
            <p className={styles.instructionText}>{t('activityExercises.completeTheWord')}</p>

            <img
                src={`/images/${activity.category}/${activity.correctItem.id}.png`}
                alt={getLocalizedName(activity.correctItem, language as Language)}
                className={styles.animalImage}
            />

            <div className={styles.sequenceRow}>
                {activity.sequence.map((item: string, index: number) => (
                    <div
                        key={index}
                        className={`${styles.sequenceItem} ${item === "?" ? styles.missingNumber : ''}`}
                    >
                        {item}
                    </div>
                ))}
            </div>

            <div className={styles.letterRow}>
                {activity.options.map((letter, index) => (
                    <button
                        key={index}
                        className={`${styles.letterButton} ${disabledLetters.includes(index) ? styles.disabledButton : ''}`}
                        onClick={() => handleAnswer(letter, index)}
                        disabled={
                            disabledLetters.includes(index) ||
                            letter.toLowerCase() !== activity.answers[activity.currentStep]?.letter.toLowerCase()
                        }
                    >
                        {letter}
                    </button>
                ))}
            </div>
        </div>
    );
}
