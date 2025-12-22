'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname?.startsWith(href);
  };

  const navItems = [
    { label: 'Home', icon: '🏠', href: '/app/home' },
    { label: 'Settings', icon: '⚙️', href: '/app/settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t border-gray-200">
      <div className="max-w-4xl mx-auto flex justify-around items-center h-20">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div
              className={`
                flex flex-col items-center justify-center
                h-20 px-6 cursor-pointer
                transition-all duration-200
                ${isActive(item.href)
                  ? 'text-blue-600 border-t-4 border-blue-600'
                  : 'text-gray-400 hover:text-gray-600'
                }
              `}
            >
              <div className="text-2xl">{item.icon}</div>
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </nav>
  );
}
