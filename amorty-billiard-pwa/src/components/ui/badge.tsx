import React from 'react';
import clsx from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'default';
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'default' }) => {
  const badgeClasses = clsx(
    'inline-block px-3 py-1 rounded-full text-xs font-medium',
    {
      'bg-green-600 text-white': variant === 'success',
      'bg-yellow-500 text-black': variant === 'warning',
      'bg-gray-700 text-white': variant === 'default',
    }
  );

  return <span className={badgeClasses}>{children}</span>;
};

export default Badge;
