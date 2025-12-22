'use client';

import { useState } from "react";
import { useActivityContext } from "../ActivityContext";
import styles from './ActivityStyles.module.css';

// Import data
import ANIMALS from '@/public/data/animals.json';
import FOOD from '@/public/data/food.json';
import OBJECTS from '@/public/data/objects.json';
import COLORS from '@/public/data/colors.json';

const questionData: Record<string, any[]> = {
    animals: ANIMALS,
    food: FOOD,
    objects: OBJECTS,
    colors: COLORS,
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

const createLang04 = () => {
    const categories = Object.keys(questionData);
    const correctCategory = getRandomItem(categories);
    const correctItem = getRandomItem(questionData[correctCategory]);

    return {
        correctCategory,
        correctItem,
        categories: shuffleArray(categories),
    };
};

const getCategoryName = (category: string): string => {
    const names: Record<string, string> = {
        animals: 'Animais',
        food: 'Alimentos',
        objects: 'Objetos',
        colors: 'Cores',
    };
    return names[category] || category;
};

export default function LANG04() {
    const { setResult } = useActivityContext();
    const [activity] = useState(createLang04());

    const handleAnswer = (selectedCategory: string) => {
        const isCorrect = selectedCategory === activity.correctCategory;
        setResult(isCorrect ? "correct" : "incorrect");
    };

    return (
        <div className={styles.container}>
            <p className={styles.instructionText}>A qual categoria pertence?</p>

            <img
                src={`/images/${activity.correctCategory}/${activity.correctItem.id}.png`}
                alt={activity.correctItem.pt}
                className={styles.animalImage}
            />

            <div className={styles.categoryGrid}>
                {activity.categories.map((category, index) => (
                    <button
                        key={index}
                        className={styles.categoryButton}
                        onClick={() => handleAnswer(category)}
                    >
                        {getCategoryName(category)}
                    </button>
                ))}
            </div>
        </div>
    );
}
