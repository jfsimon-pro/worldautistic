'use client';

import { useState } from 'react';

interface FrequencyCardProps {
  title: string;
  frequency: number;
  onPlay?: () => void;
}

export default function FrequencyCard({
  title,
  frequency,
  onPlay,
}: FrequencyCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    onPlay?.();
  };

  return (
    <div
      className={`
        bg-gradient-to-br
        ${isPlaying ? 'from-green-400 to-green-500' : 'from-blue-400 to-blue-500'}
        rounded-2xl
        p-4
        shadow-md hover:shadow-lg
        cursor-pointer
        transition-all duration-200
        transform hover:scale-105
        flex flex-col items-center justify-center
        min-h-32
      `}
      onClick={handlePlay}
    >
      <div className="text-4xl mb-2">
        {isPlaying ? '🔊' : '🔉'}
      </div>
      <p className="text-white font-bold text-center text-sm mb-2">
        {title}
      </p>
      <p className="text-white text-xs">
        {frequency} Hz
      </p>
    </div>
  );
}
