
import React from 'react';
import { Crown } from 'lucide-react';

interface ProBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showIcon?: boolean;
}

const ProBadge: React.FC<ProBadgeProps> = ({ 
  size = 'md', 
  className = '',
  showIcon = true
}) => {
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5'
  };
  
  return (
    <span 
      className={`inline-flex items-center rounded-full font-medium 
                 bg-gradient-to-r from-meme-purple to-meme-pink text-white 
                 ${sizeClasses[size]} ${className}`}
    >
      {showIcon && <Crown className={`${size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'} mr-1`} />}
      Pro
    </span>
  );
};

export default ProBadge;
