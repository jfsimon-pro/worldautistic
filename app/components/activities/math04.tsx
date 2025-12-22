'use client';

import { useState } from "react";
import { useActivityContext } from "../ActivityContext";
import styles from './ActivityStyles.module.css';

function createMath04() {
    const correctAnswer = Math.floor(Math.random() * 10) + 1;
    const numbers = [correctAnswer];

    while (numbers.length < 4) {
        const randomNum = Math.floor(Math.random() * 10) + 1;
        if (!numbers.includes(randomNum)) {
            numbers.push(randomNum);
        }
    }

    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    return {
        numbers,
        answer: correctAnswer,
    };
}

export default function MATH04() {
    const { setResult } = useActivityContext();
    const [activity] = useState(createMath04());

    const handleAnswer = (isCorrect: boolean) => {
        setResult(isCorrect ? "correct" : "incorrect");
    };

    return (
        <div className={styles.container}>
            <p className={styles.instructionText}>Quantos dedos estão levantados?</p>

            <img
                src={`/images/hands/${activity.answer}.png`}
                alt={`${activity.answer} dedos`}
                className={styles.handImage}
            />

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
