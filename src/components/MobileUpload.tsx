
import React, { useState, useRef } from 'react';
import { Camera, Image, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface MobileUploadProps {
  onImageSelected: (imageData: string) => void;
}

const MobileUpload: React.FC<MobileUploadProps> = ({ onImageSelected }) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsLoading(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onImageSelected(result);
        toast({
          title: "Image uploaded!",
          description: "Your image has been added to the canvas",
        });
      }
      setIsLoading(false);
    };
    
    reader.onerror = () => {
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your image",
        variant: "destructive"
      });
      setIsLoading(false);
    };
    
    reader.readAsDataURL(file);
  };

  const triggerFileInput = (type: 'gallery' | 'camera') => {
    if (type === 'gallery' && fileInputRef.current) {
      fileInputRef.current.click();
    } else if (type === 'camera' && cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  return (
    <div className="my-4 p-4 rounded-lg bg-gradient-to-br from-meme-darkpurple/20 to-meme-purple/10">
      <h3 className="text-lg font-semibold mb-4 text-center bg-gradient-to-r from-meme-purple to-meme-pink bg-clip-text text-transparent">
        Upload Your Own Image
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        <Button 
          onClick={() => triggerFileInput('gallery')}
          variant="outline"
          className="flex flex-col items-center justify-center py-6 h-auto border-meme-purple/30 hover:border-meme-purple/70 hover:bg-meme-purple/5 transition-all"
          disabled={isLoading}
        >
          <Image className="h-8 w-8 mb-2 text-meme-purple" />
          <span>Photo Library</span>
        </Button>
        
        <Button 
          onClick={() => triggerFileInput('camera')}
          variant="outline"
          className="flex flex-col items-center justify-center py-6 h-auto border-meme-pink/30 hover:border-meme-pink/70 hover:bg-meme-pink/5 transition-all"
          disabled={isLoading}
        >
          <Camera className="h-8 w-8 mb-2 text-meme-pink" />
          <span>Take Photo</span>
        </Button>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
      
      {isLoading && (
        <div className="mt-4 flex justify-center">
          <div className="w-6 h-6 border-2 border-meme-purple border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default MobileUpload;
