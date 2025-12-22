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

const createMath05 = (category: string) => {
    const selectedData = questionData[category];

    const subCategories = selectedData.reduce((acc: Record<string, any[]>, item) => {
        acc[item.subCategory] = acc[item.subCategory] || [];
        acc[item.subCategory].push(item);
        return acc;
    }, {});

    const subCategoryKeys = Object.keys(subCategories);
    const chosenSubCategories = subCategoryKeys.sort(() => 0.5 - Math.random()).slice(0, 2);

    const images = chosenSubCategories.flatMap((subCategory) => {
        const items = subCategories[subCategory];
        const count = Math.floor(Math.random() * 5) + 1;
        return Array(count).fill(null).map(() => getRandomItem(items));
    });

    const correctAnswer = images.length;

    const numbers = [correctAnswer];
    while (numbers.length < 4) {
        const randomNum = Math.floor(Math.random() * 12) + 1;
        if (!numbers.includes(randomNum)) {
            numbers.push(randomNum);
        }
    }

    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    return {
        images,
        numbers,
        answer: correctAnswer,
        category,
    };
};

export default function MATH05() {
    const { setResult } = useActivityContext();
    const categories = Object.keys(questionData);
    const category = getRandomItem(categories);
    const [activity] = useState(createMath05(category));

    const handleAnswer = (isCorrect: boolean) => {
        setResult(isCorrect ? "correct" : "incorrect");
    };

    const getCategoryName = (cat: string) => {
        const names: Record<string, string> = {
            animals: 'itens',
            food: 'itens',
            objects: 'itens',
        };
        return names[cat] || 'itens';
    };

    return (
        <div className={styles.container}>
            <p className={styles.instructionText}>
                Quantos {getCategoryName(activity.category)} você vê no total?
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
                        onClick={() => handleAnswer(number === activity.answer)}
                    >
                        {number}
                    </button>
                ))}
            </div>
        </div>
    );
}
