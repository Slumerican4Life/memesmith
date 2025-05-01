
import React, { useRef, useEffect, useState } from 'react';
import { MemeTemplate } from '../types/meme';
import { Button } from '@/components/ui/button';
import { Download, Share } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

interface MemeCanvasProps {
  selectedTemplate: MemeTemplate | null;
  topText: string;
  bottomText: string;
}

const MemeCanvas = ({ selectedTemplate, topText, bottomText }: MemeCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);
  const { toast } = useToast();
  
  // Load image when template changes
  useEffect(() => {
    if (!selectedTemplate) return;
    
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setImageObj(img);
      setImageLoaded(true);
    };
    img.src = selectedTemplate.url;
  }, [selectedTemplate]);
  
  // Draw canvas whenever text changes or image loads
  useEffect(() => {
    if (!canvasRef.current || !selectedTemplate || !imageLoaded || !imageObj) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions to match template
    canvas.width = selectedTemplate.width;
    canvas.height = selectedTemplate.height;
    
    // Draw image
    ctx.drawImage(imageObj, 0, 0, canvas.width, canvas.height);
    
    // Configure text style
    ctx.textAlign = 'center';
    ctx.font = 'bold 48px Impact';
    ctx.lineWidth = 5;
    
    // Draw top text
    if (topText) {
      ctx.strokeStyle = 'black';
      ctx.fillStyle = 'white';
      ctx.strokeText(
        topText, 
        selectedTemplate.textPositions.top.x, 
        selectedTemplate.textPositions.top.y
      );
      ctx.fillText(
        topText, 
        selectedTemplate.textPositions.top.x, 
        selectedTemplate.textPositions.top.y
      );
    }
    
    // Draw bottom text
    if (bottomText) {
      ctx.strokeStyle = 'black';
      ctx.fillStyle = 'white';
      ctx.strokeText(
        bottomText, 
        selectedTemplate.textPositions.bottom.x, 
        selectedTemplate.textPositions.bottom.y
      );
      ctx.fillText(
        bottomText, 
        selectedTemplate.textPositions.bottom.x, 
        selectedTemplate.textPositions.bottom.y
      );
    }
    
    // Add watermark
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.lineWidth = 1;
    ctx.strokeText('Created with SlumMemes.com', canvas.width - 120, canvas.height - 10);
    ctx.fillText('Created with SlumMemes.com', canvas.width - 120, canvas.height - 10);
    
  }, [selectedTemplate, topText, bottomText, imageLoaded, imageObj]);
  
  const downloadMeme = () => {
    if (!canvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = `slummeme-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
    
    toast({
      title: "Meme downloaded!",
      description: "Your meme has been saved to your device.",
    });
  };
  
  const shareMeme = () => {
    if (!canvasRef.current) return;
    
    navigator.clipboard.writeText(canvasRef.current.toDataURL('image/png'))
      .then(() => {
        toast({
          title: "Link copied!",
          description: "Image data URL copied to clipboard. Note: For better sharing, consider uploading to an image hosting service.",
        });
      })
      .catch(err => {
        toast({
          title: "Error copying link",
          description: "There was a problem copying the link.",
          variant: "destructive"
        });
      });
  };
  
  if (!selectedTemplate) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-card rounded-lg text-center min-h-[300px]">
        <p className="text-lg font-medium">Select a template to preview your meme</p>
        <div className="mt-4 animate-bounce-subtle">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold mb-4">Preview Your Meme</h2>
      
      <div className="bg-muted p-2 rounded-lg mb-4 max-w-full overflow-hidden shadow-lg">
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="max-w-full h-auto"
            style={{ maxHeight: '500px' }}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-card bg-opacity-50">
              <p className="text-lg font-medium">Loading...</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex space-x-4">
        <Button 
          onClick={downloadMeme}
          className="bg-meme-purple hover:bg-meme-darkpurple"
          disabled={!imageLoaded}
        >
          <Download className="mr-2 h-4 w-4" /> 
          Download
        </Button>
        
        <Button 
          onClick={shareMeme}
          variant="outline" 
          className="border-meme-purple text-meme-purple hover:bg-meme-purple/10"
          disabled={!imageLoaded}
        >
          <Share className="mr-2 h-4 w-4" /> 
          Copy Link
        </Button>
      </div>
    </div>
  );
};

export default MemeCanvas;
