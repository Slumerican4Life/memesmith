
import React, { useRef, useEffect, useState } from 'react';
import { MemeTemplate } from '../types/meme';
import { Button } from '@/components/ui/button';
import { Download, Share, Image, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
    ctx.strokeText('Created with MemeSmith.com', canvas.width - 120, canvas.height - 10);
    ctx.fillText('Created with MemeSmith.com', canvas.width - 120, canvas.height - 10);
    
  }, [selectedTemplate, topText, bottomText, imageLoaded, imageObj]);
  
  const downloadMeme = () => {
    if (!canvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = `memesmith-${Date.now()}.png`;
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
      <div className="flex flex-col items-center justify-center p-8 bg-card rounded-lg text-center min-h-[300px] border-2 border-dashed border-meme-purple/30 transition-all duration-300 hover:border-meme-purple/50">
        <Image size={48} className="text-muted-foreground/50 mb-4" />
        <p className="text-lg font-medium bg-gradient-to-r from-meme-purple to-meme-pink bg-clip-text text-transparent">Select a template to preview your meme</p>
        <div className="mt-6 animate-bounce-subtle">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/50">
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-meme-purple to-meme-pink bg-clip-text text-transparent relative group">
        Preview Your Meme
        <span className="absolute -top-3 -right-6 transform rotate-12">
          <Sparkles size={18} className="text-meme-orange animate-pulse" />
        </span>
      </h2>
      
      <div className="bg-gradient-to-r from-meme-darkpurple via-meme-purple to-meme-pink p-1 rounded-lg mb-6 max-w-full overflow-hidden shadow-xl transform transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl">
        <div className="relative bg-black rounded-md overflow-hidden">
          <canvas
            ref={canvasRef}
            className="max-w-full h-auto"
            style={{ maxHeight: '500px' }}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-card bg-opacity-80 backdrop-blur-sm">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-meme-purple border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-lg font-medium">Loading...</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
        <Button 
          onClick={downloadMeme}
          className="bg-gradient-to-r from-meme-purple via-meme-darkpurple to-meme-purple hover:opacity-90 transform transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-md"
          disabled={!imageLoaded}
        >
          <Download className="mr-2 h-4 w-4" /> 
          Download Meme
        </Button>
        
        <Button 
          onClick={shareMeme}
          variant="outline" 
          className="border-meme-pink text-meme-pink hover:bg-meme-pink/10 transform transition-all duration-300 hover:scale-105 shadow-md"
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
