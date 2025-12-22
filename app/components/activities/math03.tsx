'use client';

import { useState } from "react";
import { useActivityContext } from "../ActivityContext";
import styles from './ActivityStyles.module.css';

// Import data
import ANIMALS from '@/public/data/animals.json';

const createMath03 = () => {
    const randomAnimal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    const chosenAnimal = randomAnimal;
    const numbers = [chosenAnimal.legs];

    while (numbers.length < 4) {
        const randomNum = Math.floor(Math.random() * 8) + 1;
        if (!numbers.includes(randomNum)) {
            numbers.push(randomNum);
        }
    }

    // Shuffle numbers
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    return {
        numbers,
        answer: chosenAnimal,
    };
};

export default function MATH03() {
    const { setResult } = useActivityContext();
    const [activity] = useState(createMath03());

    const handleAnswer = (selectedNumber: number) => {
        const isCorrect = selectedNumber === activity.answer.legs;
        setResult(isCorrect ? "correct" : "incorrect");
    };

    return (
        <div className={styles.container}>
            <p className={styles.instructionText}>Quantas patas tem esse animal?</p>

            <div className={styles.imageRow}>
                <img
                    src={`/images/animals/${activity.answer.id}.png`}
                    alt={activity.answer.pt || activity.answer.id}
                    className={styles.animalImage}
                />
            </div>

            <div className={styles.optionsGrid}>
                {activity.numbers.map((num, index) => (
                    <button
                        key={index}
                        className={styles.optionButton}
                        onClick={() => handleAnswer(num)}
                    >
                        {num}
                    </button>
                ))}
            </div>
        </div>
    );
}
