
import React from 'react';
import { MemeTemplate } from '../types/meme';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles } from 'lucide-react';

interface MemeEditorProps {
  selectedTemplate: MemeTemplate | null;
  topText: string;
  bottomText: string;
  onTextChange: (type: 'top' | 'bottom', value: string) => void;
}

const MemeEditor = ({ 
  selectedTemplate, 
  topText, 
  bottomText, 
  onTextChange 
}: MemeEditorProps) => {
  if (!selectedTemplate) {
    return (
      <div className="flex flex-col p-6 bg-gradient-to-br from-card to-card/80 rounded-lg text-center border border-meme-purple/10 shadow-md">
        <p className="text-lg font-medium bg-gradient-to-r from-meme-purple to-meme-pink bg-clip-text text-transparent">Please select a meme template to start editing</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-6 bg-gradient-to-br from-card to-card/90 rounded-lg border border-meme-purple/20 shadow-lg">
      <div className="flex items-center mb-4">
        <h2 className="text-xl font-bold bg-gradient-to-r from-meme-blue to-meme-purple bg-clip-text text-transparent">Edit Your Meme</h2>
        <Sparkles size={16} className="ml-2 text-meme-orange" />
      </div>
      
      <div className="space-y-5">
        <div className="space-y-2 relative group">
          <Label htmlFor="topText" className="text-sm font-medium text-muted-foreground group-hover:text-meme-blue transition-colors duration-300">Top Text</Label>
          <Input
            id="topText"
            type="text"
            value={topText}
            onChange={(e) => onTextChange('top', e.target.value)}
            placeholder="Enter top text"
            className="w-full bg-background/60 backdrop-blur-sm border-meme-purple/20 focus:border-meme-blue transition-all duration-300 placeholder:text-muted-foreground/50"
          />
        </div>
        
        <div className="space-y-2 relative group">
          <Label htmlFor="bottomText" className="text-sm font-medium text-muted-foreground group-hover:text-meme-pink transition-colors duration-300">Bottom Text</Label>
          <Input
            id="bottomText"
            type="text"
            value={bottomText}
            onChange={(e) => onTextChange('bottom', e.target.value)}
            placeholder="Enter bottom text"
            className="w-full bg-background/60 backdrop-blur-sm border-meme-purple/20 focus:border-meme-pink transition-all duration-300 placeholder:text-muted-foreground/50"
          />
        </div>
        
        <div className="pt-2 text-xs text-muted-foreground/70 bg-meme-purple/5 p-2 rounded-md">
          <p className="font-medium mb-1">Pro Tips:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Keep text short and punchy for maximum impact</li>
            <li>ALL CAPS often works best for classic meme style</li>
            <li>Try different templates if your text doesn't fit well</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MemeEditor;
