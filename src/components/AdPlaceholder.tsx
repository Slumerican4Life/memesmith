
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface AdPlaceholderProps {
  id: string;
  className?: string;
  format?: 'banner' | 'rectangle' | 'sidebar';
}

const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ 
  id, 
  className = '', 
  format = 'banner' 
}) => {
  const { profile } = useAuth();
  const isPro = profile?.is_pro || false;

  // Don't render ads for Pro users
  if (isPro) {
    return null;
  }

  let heightClass = 'h-[90px]'; // Default banner height
  let widthClass = 'w-full';
  
  if (format === 'rectangle') {
    heightClass = 'h-[250px]';
    widthClass = 'w-[300px]';
  } else if (format === 'sidebar') {
    heightClass = 'h-[600px]';
    widthClass = 'w-[160px]';
  }

  return (
    <div 
      id={id}
      className={`ad-placeholder ${widthClass} ${heightClass} bg-muted/20 rounded-md flex items-center justify-center border border-muted/30 overflow-hidden ${className}`}
      data-ad-slot="placeholder"
      data-ad-format={format}
    >
      <div className="text-xs text-muted-foreground/50 text-center px-2">
        <span className="sr-only">Advertisement</span>
        {/* This space will be filled by AdSense */}
      </div>
    </div>
  );
};

export default AdPlaceholder;
