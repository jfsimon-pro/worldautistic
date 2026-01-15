'use client';

import { useState, useEffect } from 'react';
import PageLayout from '../../components/PageLayout';
import styles from '../../styles/MemoryGame.module.css';
import { useTranslation } from '../../context/LanguageContext';

interface Card {
    id: string;
    image: string;
    isRevealed: boolean;
    isMatched: boolean;
    color: string;
}

// Sample items for the memory game
const ITEMS = [
    { id: 'dog', image: '/images/animals/dog.png', color: '#FFE0B2' },
    { id: 'cat', image: '/images/animals/cat.png', color: '#E1BEE7' },
    { id: 'rabbit', image: '/images/animals/rabbit.png', color: '#BBDEFB' },
    { id: 'turtle', image: '/images/animals/turtle.png', color: '#C8E6C9' },
    { id: 'apple', image: '/images/food/apple.png', color: '#FFCDD2' },
    { id: 'banana', image: '/images/food/banana.png', color: '#FFF9C4' },
    { id: 'red', image: '/images/colors/red.png', color: '#FFCDD2' },
    { id: 'blue', image: '/images/colors/blue.png', color: '#BBDEFB' },
];

function shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function generateCards(): Card[] {
    const selectedItems = shuffleArray(ITEMS).slice(0, 8);
    const cards = selectedItems.flatMap((item) => [
        { ...item, id: `${item.id}-1`, isRevealed: false, isMatched: false },
        { ...item, id: `${item.id}-2`, isRevealed: false, isMatched: false },
    ]);
    return shuffleArray(cards);
}

export default function MemoryGamePage() {
    const { t } = useTranslation();
    const [cards, setCards] = useState<Card[]>([]);
    const [selectedCards, setSelectedCards] = useState<string[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showWinModal, setShowWinModal] = useState(false);

    useEffect(() => {
        setCards(generateCards());
    }, []);

    const handleCardClick = (id: string) => {
        if (isProcessing || selectedCards.length >= 2) return;

        const card = cards.find(c => c.id === id);
        if (!card || card.isRevealed || card.isMatched) return;

        const newCards = cards.map(c =>
            c.id === id ? { ...c, isRevealed: true } : c
        );
        setCards(newCards);
        setSelectedCards([...selectedCards, id]);
    };

    useEffect(() => {
        if (selectedCards.length === 2) {
            setIsProcessing(true);
            const [firstId, secondId] = selectedCards;

            // Check if images match (same base id)
            const firstBaseId = firstId.replace(/-\d$/, '');
            const secondBaseId = secondId.replace(/-\d$/, '');

            if (firstBaseId === secondBaseId) {
                // Match!
                setTimeout(() => {
                    setCards(prev => prev.map(c =>
                        c.id === firstId || c.id === secondId ? { ...c, isMatched: true } : c
                    ));
                    setSelectedCards([]);
                    setIsProcessing(false);
                }, 500);
            } else {
                // No match
                setTimeout(() => {
                    setCards(prev => prev.map(c =>
                        c.id === firstId || c.id === secondId ? { ...c, isRevealed: false } : c
                    ));
                    setSelectedCards([]);
                    setIsProcessing(false);
                }, 1000);
            }
        }
    }, [selectedCards, cards]);

    useEffect(() => {
        if (cards.length > 0 && cards.every(c => c.isMatched)) {
            setShowWinModal(true);
        }
    }, [cards]);

    const resetGame = () => {
        setCards(generateCards());
        setSelectedCards([]);
        setIsProcessing(false);
        setShowWinModal(false);
    };

    return (
        <PageLayout backHref="/home">
            <div className={styles.container}>
                <h1 className={styles.title}>{t('games.memoryGame')}</h1>

                <div className={styles.grid}>
                    {cards.map(card => (
                        <div
                            key={card.id}
                            className={`${styles.card} ${card.isRevealed || card.isMatched ? styles.revealed : ''} ${card.isMatched ? styles.matched : ''}`}
                            style={{ backgroundColor: card.isRevealed || card.isMatched ? card.color : '#3B82F6' }}
                            onClick={() => handleCardClick(card.id)}
                        >
                            {(card.isRevealed || card.isMatched) ? (
                                <img src={card.image} alt="" className={styles.cardImage} />
                            ) : (
                                <div className={styles.cardBack}>?</div>
                            )}
                        </div>
                    ))}
                </div>

                <button className={styles.resetButton} onClick={resetGame}>
                    {t('games.restart')}
                </button>

                {/* Win Modal */}
                {showWinModal && (
                    <div className={styles.modal}>
                        <div className={styles.modalContent}>
                            <img src="/images/spaceman-victory.png" alt="Victory" className={styles.modalImage} />
                            <h2 className={styles.modalTitle}>{t('games.congratulations')}</h2>
                            <p className={styles.modalText}>{t('games.completed')}</p>
                            <button className={styles.modalButton} onClick={resetGame}>
                                {t('games.playAgain')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </PageLayout>
    );
}
