'use client';

import { useState } from "react";
import { useActivityContext } from "../ActivityContext";
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

const createMath02 = (category: string) => {
    const selectedData = questionData[category];
    const correctItem = getRandomItem(selectedData);
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
        images: Array(correctAnswer).fill(correctItem),
        numbers,
        answer: correctAnswer,
        category,
    };
};

export default function MATH02() {
    const { setResult } = useActivityContext();
    const categories = Object.keys(questionData);
    const category = getRandomItem(categories);
    const [activity] = useState(createMath02(category));

    const handleAnswer = (number: number) => {
        setResult(number === activity.answer ? "correct" : "incorrect");
    };

    const getCategoryName = (cat: string) => {
        const names: Record<string, string> = {
            animals: 'animais',
            food: 'alimentos',
            objects: 'objetos',
        };
        return names[cat] || cat;
    };

    return (
        <div className={styles.container}>
            <p className={styles.instructionText}>
                Quantos {getCategoryName(activity.category)} você vê?
            </p>

            <div className={styles.imageRow}>
                {activity.images.map((item: any, index: number) => (
                    <img
                        key={index}
                        src={`/images/${activity.category}/${item.id}.png`}
                        alt={item.name}
                        className={styles.itemImage}
                    />
                ))}
            </div>

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
