import React, { useRef, useEffect } from 'react';
import { MemeTemplate } from '@/types/meme';

interface MemeCanvasProps {
  selectedTemplate: MemeTemplate | null;
  customImage?: string;
  topText: string;
  bottomText: string;
}

const MemeCanvas: React.FC<MemeCanvasProps> = ({ selectedTemplate, customImage, topText, bottomText }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
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
      ctx.drawImage(img, 0, 0, width, height);
      
      // Configure text styles
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.textAlign = 'center';
      ctx.font = '40px sans-serif';
      ctx.lineWidth = 2;
      
      // Draw top text
      ctx.fillText(topText.toUpperCase(), width / 2, 50);
      ctx.strokeText(topText.toUpperCase(), width / 2, 50);
      
      // Draw bottom text
      ctx.fillText(bottomText.toUpperCase(), width / 2, height - 20);
      ctx.strokeText(bottomText.toUpperCase(), width / 2, height - 20);
    };
    
    // Set image source based on template or custom image
    if (customImage) {
      img.src = customImage;
    } else if (selectedTemplate) {
      img.src = selectedTemplate.url;
    }
  }, [selectedTemplate, customImage, topText, bottomText]);
  
  return (
    <canvas ref={canvasRef} className="w-full rounded-lg shadow-md border border-border bg-card" />
  );
};

export default MemeCanvas;
