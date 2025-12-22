'use client';

import Link from 'next/link';
import Image from 'next/image';

interface HomeCardProps {
  title: string;
  image?: string;
  icon?: string;
  href: string;
  color?: string;
  size?: 'small' | 'large';
}

const colorMap: Record<string, string> = {
  'wa-numbers': '#AAD3E9',
  'wa-letters': '#F98EB0',
  'wa-animals': '#8ECF99',
  'wa-food': '#E07A5F',
  'wa-objects': '#6A4C93',
  'wa-colors': '#D9F99D',
  'blue': 'from-blue-400 to-blue-500',
  'purple': 'from-purple-400 to-purple-500',
  'green': 'from-green-400 to-green-500',
  'pink': 'from-pink-400 to-pink-500',
  'yellow': 'from-yellow-400 to-yellow-500',
  'red': 'from-red-400 to-red-500',
};

export default function HomeCard({
  title,
  image,
  icon,
  href,
  color = 'blue',
  size = 'large',
}: HomeCardProps) {
  const gradientColor = colorMap[color] || colorMap['blue'];
  const isHexColor = gradientColor.startsWith('#');

  const sizeClasses = size === 'large'
    ? 'p-6 h-48'
    : 'p-4 h-24';

  return (
    <Link href={href}>
      <div
        className={`
          ${sizeClasses}
          rounded-3xl
          shadow-lg hover:shadow-2xl
          cursor-pointer
          transition-all duration-300
          transform hover:scale-105 hover:-translate-y-2
          flex flex-col items-center justify-center
          text-white
          font-bold
          overflow-hidden
          relative
        `}
        style={{
          backgroundColor: isHexColor ? gradientColor : undefined,
          background: !isHexColor ? `linear-gradient(135deg, ${gradientColor})` : undefined,
        }}
      >
        {image && (
          <div className="absolute inset-0 opacity-40 flex items-center justify-center">
            <Image
              src={image}
              alt={title}
              width={120}
              height={120}
              className="object-cover"
            />
          </div>
        )}
        <div className="relative z-10 text-center">
          {icon && (
            <div className={size === 'large' ? 'text-5xl mb-2' : 'text-4xl mb-1'}>
              {icon}
            </div>
          )}
          <p className={size === 'large' ? 'text-lg text-center font-bold' : 'text-sm text-center'}>
            {title}
          </p>
        </div>
      </div>
    </Link>
  );
}
