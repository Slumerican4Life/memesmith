
import React, { useState } from 'react';
import { MemeTemplate } from '../types/meme';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
      <div className="flex flex-col p-4 bg-card rounded-lg text-center">
        <p className="text-lg font-medium">Please select a meme template to start editing</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4 bg-card rounded-lg">
      <h2 className="text-xl font-bold mb-4">Edit Your Meme</h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="topText">Top Text</Label>
          <Input
            id="topText"
            type="text"
            value={topText}
            onChange={(e) => onTextChange('top', e.target.value)}
            placeholder="Enter top text"
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bottomText">Bottom Text</Label>
          <Input
            id="bottomText"
            type="text"
            value={bottomText}
            onChange={(e) => onTextChange('bottom', e.target.value)}
            placeholder="Enter bottom text"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default MemeEditor;
