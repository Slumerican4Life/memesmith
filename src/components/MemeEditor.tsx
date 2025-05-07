
import React from 'react';
import { MemeTemplate } from '../types/meme';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ProBadge from './ProBadge';

interface MemeEditorProps {
  selectedTemplate: MemeTemplate | null;
  topText: string;
  bottomText: string;
  onTextChange: (type: 'top' | 'bottom', value: string) => void;
  effect?: 'none' | 'glow' | 'golden';
  onEffectChange?: (effect: 'none' | 'glow' | 'golden') => void;
}

const MemeEditor = ({ 
  selectedTemplate, 
  topText, 
  bottomText, 
  onTextChange,
  effect = 'none',
  onEffectChange
}: MemeEditorProps) => {
  const { profile } = useAuth();
  const isPro = profile?.is_pro || false;
  
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
        
        {/* Pro Effects Section */}
        {isPro && onEffectChange && (
          <div className="pt-3 border-t border-meme-purple/10">
            <div className="flex items-center mb-2">
              <Label className="text-sm font-medium flex items-center">
                Pro Effects
                <ProBadge size="sm" className="ml-2" />
              </Label>
            </div>
            
            <RadioGroup
              value={effect}
              onValueChange={(value) => onEffectChange(value as 'none' | 'glow' | 'golden')}
              className="flex items-center space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="effect-none" />
                <Label htmlFor="effect-none" className="text-sm">None</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="glow" id="effect-glow" />
                <Label htmlFor="effect-glow" className="text-sm">Glow</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="golden" id="effect-golden" />
                <Label htmlFor="effect-golden" className="text-sm">Golden</Label>
              </div>
            </RadioGroup>
          </div>
        )}
        
        {/* Pro Tips Section */}
        <div className="pt-2 text-xs text-muted-foreground/70 bg-meme-purple/5 p-2 rounded-md">
          <p className="font-medium mb-1">Pro Tips:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Keep text short and punchy for maximum impact</li>
            <li>ALL CAPS often works best for classic meme style</li>
            <li>Try different templates if your text doesn't fit well</li>
            {!isPro && (
              <li className="text-meme-purple">
                <span className="font-semibold">Upgrade to Pro</span> to remove watermark and unlock effects!
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MemeEditor;
