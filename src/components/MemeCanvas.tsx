
import React, { useRef, useEffect, useState } from 'react';
import { MemeTemplate } from '../types/meme';
import { Button } from '@/components/ui/button';
import { Download, Share, Image, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DraggableText from './DraggableText';
import { useIsMobile } from '@/hooks/use-mobile';

interface MemeCanvasProps {
  selectedTemplate: MemeTemplate | null;
  topText: string;
  bottomText: string;
  customImage?: string;
}

const MemeCanvas = ({ selectedTemplate, topText, bottomText, customImage }: MemeCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [topTextPosition, setTopTextPosition] = useState({ x: 0, y: 0 });
  const [bottomTextPosition, setBottomTextPosition] = useState({ x: 0, y: 0 });
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Initialize positions when template changes
  useEffect(() => {
    if (selectedTemplate) {
      setTopTextPosition({
        x: selectedTemplate.textPositions.top.x,
        y: selectedTemplate.textPositions.top.y,
      });
      
      setBottomTextPosition({
        x: selectedTemplate.textPositions.bottom.x,
        y: selectedTemplate.textPositions.bottom.y,
      });
    }
  }, [selectedTemplate]);
  
  // Load image when template changes
  useEffect(() => {
    if (!selectedTemplate && !customImage) return;
    
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setImageObj(img);
      setImageLoaded(true);
    };
    img.src = customImage || (selectedTemplate ? selectedTemplate.url : '');
  }, [selectedTemplate, customImage]);
  
  // Update canvas size on resize
  useEffect(() => {
    const updateCanvasSize = () => {
      if (!containerRef.current || !imageObj) return;
      
      const containerWidth = containerRef.current.clientWidth;
      let width, height;
      
      // If we have a custom image, use its aspect ratio
      if (customImage && imageObj) {
        const aspectRatio = imageObj.height / imageObj.width;
        width = Math.min(containerWidth, 600); // Max width of 600px
        height = width * aspectRatio;
      } else if (selectedTemplate && imageObj) {
        // For template images, respect their original dimensions but scale down if needed
        const aspectRatio = selectedTemplate.height / selectedTemplate.width;
        width = Math.min(containerWidth, selectedTemplate.width);
        height = width * aspectRatio;
      } else {
        width = containerWidth;
        height = width * 0.75; // Default aspect ratio
      }
      
      setCanvasSize({ width, height });
    };
    
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [imageObj, selectedTemplate, customImage]);
  
  // Draw canvas whenever text changes, positions change, or image loads
  useEffect(() => {
    if (!canvasRef.current || (!selectedTemplate && !customImage) || !imageLoaded || !imageObj) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw image
    ctx.drawImage(imageObj, 0, 0, canvas.width, canvas.height);
    
    // For mobile with draggable text, we don't need to draw text on canvas here
    // as it's handled by the DraggableText components overlaying the canvas
    if (!isMobile) {
      // Configure text style
      ctx.textAlign = 'center';
      ctx.font = 'bold 48px Impact';
      ctx.lineWidth = 5;
      
      // Draw top text
      if (topText) {
        const x = (topTextPosition.x / (selectedTemplate?.width || imageObj.width)) * canvas.width;
        const y = (topTextPosition.y / (selectedTemplate?.height || imageObj.height)) * canvas.height;
        
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'white';
        ctx.strokeText(topText, x, y);
        ctx.fillText(topText, x, y);
      }
      
      // Draw bottom text
      if (bottomText) {
        const x = (bottomTextPosition.x / (selectedTemplate?.width || imageObj.width)) * canvas.width;
        const y = (bottomTextPosition.y / (selectedTemplate?.height || imageObj.height)) * canvas.height;
        
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'white';
        ctx.strokeText(bottomText, x, y);
        ctx.fillText(bottomText, x, y);
      }
    }
    
    // Add watermark
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.lineWidth = 1;
    ctx.strokeText('MemeSmith.com', canvas.width - 70, canvas.height - 10);
    ctx.fillText('MemeSmith.com', canvas.width - 70, canvas.height - 10);
    
  }, [
    selectedTemplate, topText, bottomText, imageLoaded, imageObj, 
    canvasSize, topTextPosition, bottomTextPosition, isMobile, customImage
  ]);
  
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
    
    // On mobile, use the Web Share API if available
    if (navigator.share) {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) {
          toast({
            title: "Error sharing meme",
            description: "There was a problem generating your meme.",
            variant: "destructive"
          });
          return;
        }
        
        const file = new File([blob], "memesmith-meme.png", { type: blob.type });
        
        try {
          await navigator.share({
            title: "My MemeSmith Creation",
            text: "Check out the meme I created with MemeSmith!",
            files: [file]
          });
        } catch (err) {
          console.error("Error sharing:", err);
          // Fallback to clipboard
          navigator.clipboard.writeText(canvasRef.current!.toDataURL('image/png'))
            .then(() => {
              toast({
                title: "Link copied!",
                description: "Image data URL copied to clipboard.",
              });
            });
        }
      });
    } else {
      // Fallback to clipboard for desktop
      navigator.clipboard.writeText(canvasRef.current.toDataURL('image/png'))
        .then(() => {
          toast({
            title: "Link copied!",
            description: "Image data URL copied to clipboard.",
          });
        })
        .catch(err => {
          toast({
            title: "Error copying link",
            description: "There was a problem copying the link.",
            variant: "destructive"
          });
        });
    }
  };
  
  if (!selectedTemplate && !customImage) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-card rounded-lg text-center min-h-[300px] border-2 border-dashed border-meme-purple/30 transition-all duration-300 hover:border-meme-purple/50">
        <Image size={48} className="text-muted-foreground/50 mb-4" />
        <p className="text-lg font-medium bg-gradient-to-r from-meme-purple to-meme-pink bg-clip-text text-transparent">Select a template or upload an image</p>
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
      
      <div 
        ref={containerRef}
        className="bg-gradient-to-r from-meme-darkpurple via-meme-purple to-meme-pink p-1 rounded-lg mb-6 max-w-full overflow-hidden shadow-xl transform transition-all duration-300 hover:shadow-2xl relative"
      >
        <div className="relative bg-black rounded-md overflow-hidden">
          <canvas
            ref={canvasRef}
            className="max-w-full h-auto block"
            width={canvasSize.width}
            height={canvasSize.height}
          />
          
          {/* Mobile draggable text overlays */}
          {isMobile && imageLoaded && (
            <>
              <DraggableText
                initialText={topText}
                initialPosition={topTextPosition}
                onTextChange={(text) => {}} // We still get text from parent component
                onPositionChange={setTopTextPosition}
              />
              <DraggableText
                initialText={bottomText}
                initialPosition={bottomTextPosition}
                onTextChange={(text) => {}} // We still get text from parent component
                onPositionChange={setBottomTextPosition}
              />
            </>
          )}
          
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
      
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
        <Button 
          onClick={downloadMeme}
          className="bg-gradient-to-r from-meme-purple via-meme-darkpurple to-meme-purple hover:opacity-90 transform transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-md w-full sm:w-auto"
          disabled={!imageLoaded}
        >
          <Download className="mr-2 h-4 w-4" /> 
          Download Meme
        </Button>
        
        <Button 
          onClick={shareMeme}
          variant="outline" 
          className="border-meme-pink text-meme-pink hover:bg-meme-pink/10 transform transition-all duration-300 hover:scale-105 shadow-md w-full sm:w-auto"
          disabled={!imageLoaded}
        >
          <Share className="mr-2 h-4 w-4" /> 
          {navigator.share ? "Share Meme" : "Copy Link"}
        </Button>
      </div>
    </div>
  );
};

export default MemeCanvas;
