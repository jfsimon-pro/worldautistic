'use client';

import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'small' | 'medium' | 'large';
}

const sizeMap = {
  small: 'max-w-sm',
  medium: 'max-w-md',
  large: 'max-w-2xl',
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={`
          relative bg-white rounded-2xl shadow-2xl
          ${sizeMap[size]}
          w-full mx-4 p-6
          max-h-[90vh] overflow-y-auto
          animate-fade-in
        `}
      >
        {title && (
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  );
}
