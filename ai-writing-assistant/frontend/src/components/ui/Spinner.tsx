import React from 'react';
import { theme } from '@/app/theme';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  };

  const borderWidth = {
    sm: 'border-2',
    md: 'border-2',
    lg: 'border-3',
  };

  return (
    <div className={`${className} flex justify-center items-center`}>
      <div
        className={`${sizeClasses[size]} ${borderWidth[size]} border-t-[#0072df] border-r-[#0072df] border-b-transparent border-l-transparent rounded-full animate-spin`}
        style={{ animationDuration: '0.7s' }}
      ></div>
    </div>
  );
};

export default Spinner;
