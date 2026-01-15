'use client';

import React, { useEffect, useRef } from "react";
import styles from '../styles/AnswerModal.module.css';
import { useLanguage } from "../context/LanguageContext";

interface AnswerModalProps {
    result: "correct" | "incorrect" | null;
    handleModalClose: () => void;
}

const AnswerModal: React.FC<AnswerModalProps> = ({ result, handleModalClose }) => {
    const { t } = useLanguage();
    const correctSoundRef = useRef<HTMLAudioElement | null>(null);
    const incorrectSoundRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (result === "correct" && correctSoundRef.current) {
            correctSoundRef.current.volume = 0.3;
            correctSoundRef.current.play().catch(console.error);
        }
        if (result === "incorrect" && incorrectSoundRef.current) {
            incorrectSoundRef.current.volume = 0.3;
            incorrectSoundRef.current.play().catch(console.error);
        }
    }, [result]);

    if (!result) return null;

    const isCorrect = result === "correct";

    return (
        <div className={styles.overlay}>
            <audio ref={correctSoundRef} src="/audio/soundEffects/correct.mp3" preload="auto" />
            <audio ref={incorrectSoundRef} src="/audio/soundEffects/incorrect.mp3" preload="auto" />

            <div className={styles.modal}>
                <p className={styles.modalText}>
                    {isCorrect ? t('feedback.congratulations') : t('feedback.ops')}
                </p>

                <img
                    src={isCorrect ? "/images/check.png" : "/images/error.png"}
                    alt={isCorrect ? t('feedback.correct') : t('feedback.incorrect')}
                    className={styles.logo}
                />

                <p className={styles.modalText}>
                    {isCorrect ? t('feedback.correct') : t('feedback.incorrect')}
                </p>

                <button className={styles.button} onClick={handleModalClose}>
                    {isCorrect ? t('feedback.next') : t('feedback.tryAgain')}
                </button>
            </div>
        </div>
    );
};

export default AnswerModal;
