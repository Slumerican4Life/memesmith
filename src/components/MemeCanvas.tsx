
import React, { useRef, useEffect, useState } from 'react';
import { MemeTemplate } from '@/types/meme';
import { useAuth } from '@/contexts/AuthContext';

interface MemeCanvasProps {
  selectedTemplate: MemeTemplate | null;
  customImage?: string;
  topText: string;
  bottomText: string;
  effect?: 'none' | 'glow' | 'golden';
}

const MemeCanvas: React.FC<MemeCanvasProps> = ({ 
  selectedTemplate, 
  customImage, 
  topText, 
  bottomText,
  effect = 'none'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { profile } = useAuth();
  const isPro = profile?.is_pro || false;
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const width = 500;
    const height = 400;
    canvas.width = width;
    canvas.height = height;
    
    // Load image
    const img = new Image();
    img.crossOrigin = "anonymous"; // Enable cross-origin loading
    
    img.onload = () => {
      // Draw image on canvas
      ctx.clearRect(0, 0, width, height);
      
      // Apply pro effects if user is pro
      if (isPro && effect !== 'none') {
        // Apply effects based on selected effect
        if (effect === 'glow') {
          // Create glow effect
          ctx.shadowColor = '#8B5CF6';
          ctx.shadowBlur = 30;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          ctx.fillRect(0, 0, width, height);
          ctx.shadowBlur = 0;
        } else if (effect === 'golden') {
          // Create golden frame
          const gradient = ctx.createLinearGradient(0, 0, width, height);
          gradient.addColorStop(0, '#FFD700');
          gradient.addColorStop(0.5, '#FFA500');
          gradient.addColorStop(1, '#FF8C00');
          
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 20;
          ctx.strokeRect(0, 0, width, height);
        }
      }
      
      // Draw the image
      ctx.drawImage(img, 0, 0, width, height);
      
      // Configure text styles
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.textAlign = 'center';
      ctx.font = '40px Impact, sans-serif';
      ctx.lineWidth = 2;
      
      // Draw top text
      ctx.fillText(topText.toUpperCase(), width / 2, 50);
      ctx.strokeText(topText.toUpperCase(), width / 2, 50);
      
      // Draw bottom text
      ctx.fillText(bottomText.toUpperCase(), width / 2, height - 20);
      ctx.strokeText(bottomText.toUpperCase(), width / 2, height - 20);
      
      // Add watermark if not Pro
      if (!isPro) {
        ctx.font = '14px Arial, sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.lineWidth = 0.5;
        ctx.textAlign = 'end';
        ctx.fillText('MemeSmith.com', width - 10, height - 10);
        ctx.strokeText('MemeSmith.com', width - 10, height - 10);
      }
    };
    
    // Set image source based on template or custom image
    if (customImage) {
      img.src = customImage;
    } else if (selectedTemplate) {
      img.src = selectedTemplate.url;
    }
  }, [selectedTemplate, customImage, topText, bottomText, isPro, effect]);
  
  return (
    <canvas ref={canvasRef} className="w-full rounded-lg shadow-md border border-border bg-card" />
  );
};

export default MemeCanvas;
