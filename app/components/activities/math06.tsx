'use client';

import { useState } from "react";
import { useActivityContext } from "../ActivityContext";
import styles from './ActivityStyles.module.css';

const createMath06 = () => {
    const startNumber = Math.floor(Math.random() * 20) + 1;
    const sequence: (string | number)[] = Array.from({ length: 4 }, (_, i) => startNumber + i);
    const missingIndex = Math.floor(Math.random() * 4);
    const correctAnswer = sequence[missingIndex];
    sequence[missingIndex] = "?";

    const numbers = [correctAnswer];
    while (numbers.length < 4) {
        const randomNum = Math.floor(Math.random() * 30) + 1;
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
        sequence,
        numbers,
        answer: correctAnswer,
    };
};

export default function MATH06() {
    const { setResult } = useActivityContext();
    const [activity] = useState(createMath06());

    const handleAnswer = (isCorrect: boolean) => {
        setResult(isCorrect ? "correct" : "incorrect");
    };

    return (
        <div className={styles.container}>
            <p className={styles.instructionText}>Qual número está faltando?</p>

            <div className={styles.sequenceRow}>
                {activity.sequence.map((item, index) => (
                    <div
                        key={index}
                        className={`${styles.sequenceItem} ${item === "?" ? styles.missingNumber : ''}`}
                    >
                        {item}
                    </div>
                ))}
            </div>

            <div className={styles.optionsGrid}>
                {activity.numbers.map((number, index) => (
                    <button
                        key={index}
                        className={styles.optionButton}
                        onClick={() => handleAnswer(number === activity.answer)}
                    >
                        {number}
                    </button>
                ))}
            </div>
        </div>
    );
}
