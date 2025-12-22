'use client';

interface MemoryGameCardProps {
  id: string;
  isFlipped: boolean;
  onClick: () => void;
  emoji?: string;
}

export default function MemoryGameCard({
  isFlipped,
  onClick,
  emoji = '?',
}: MemoryGameCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        aspect-square
        bg-gradient-to-br
        ${isFlipped
          ? 'from-blue-300 to-blue-400'
          : 'from-purple-400 to-purple-500'
        }
        rounded-lg
        cursor-pointer
        flex items-center justify-center
        shadow-md hover:shadow-lg
        transition-all duration-300
        transform hover:scale-105
        text-4xl font-bold
        select-none
      `}
    >
      {isFlipped ? emoji : '?'}
    </div>
  );
}
