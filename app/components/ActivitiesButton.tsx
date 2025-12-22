'use client';

import Link from 'next/link';

interface ActivitiesButtonProps {
  label: string;
  icon: string;
  href: string;
  color?: string;
}

export default function ActivitiesButton({
  label,
  icon,
  href,
  color = 'from-blue-400 to-blue-500',
}: ActivitiesButtonProps) {
  return (
    <Link href={href}>
      <div
        className={`
          bg-gradient-to-br ${color}
          rounded-2xl
          p-4
          shadow-md hover:shadow-lg
          cursor-pointer
          transition-all duration-200
          transform hover:scale-105 hover:-translate-y-1
          flex flex-col items-center justify-center
          text-white
          font-bold
          min-h-28
        `}
      >
        <div className="text-4xl mb-2">{icon}</div>
        <p className="text-center text-sm">{label}</p>
      </div>
    </Link>
  );
}
