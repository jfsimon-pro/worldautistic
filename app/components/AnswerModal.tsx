'use client';

import React, { useEffect, useRef } from "react";
import styles from '../styles/AnswerModal.module.css';

interface AnswerModalProps {
    result: "correct" | "incorrect" | null;
    handleModalClose: () => void;
}

const AnswerModal: React.FC<AnswerModalProps> = ({ result, handleModalClose }) => {
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
                    {isCorrect ? "Parabéns!" : "Ops!"}
                </p>

                <img
                    src={isCorrect ? "/images/check.png" : "/images/error.png"}
                    alt={isCorrect ? "Correto" : "Incorreto"}
                    className={styles.logo}
                />

                <p className={styles.modalText}>
                    {isCorrect ? "Você acertou!" : "Tente novamente!"}
                </p>

                <button className={styles.button} onClick={handleModalClose}>
                    {isCorrect ? "Próximo" : "Tentar novamente"}
                </button>
            </div>
        </div>
    );
};

export default AnswerModal;
