'use client';

interface DefaultButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export default function DefaultButton({
  label,
  onClick,
  disabled = false,
  className = '',
  type = 'button',
}: DefaultButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full
        min-w-full
        py-[18px] px-[60px]
        rounded-[30px]
        font-bold text-[16px] leading-[21px] tracking-wide
        bg-[#FFE500] text-[#6f5300]
        border-b-4 border-r-4 border-l border-[#F1B812]
        shadow-md
        active:shadow-none active:translate-y-1 active:translate-x-1
        disabled:bg-gray-200 disabled:border-gray-300 disabled:text-gray-400
        transition-all duration-200
        flex items-center justify-center
        ${className}
      `}
    >
      {label}
    </button>
  );
}
