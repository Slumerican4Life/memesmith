
import React from 'react';
import { MemeTemplate } from '../types/meme';
import { Card, CardContent } from '@/components/ui/card';

interface MemeGalleryProps {
  templates: MemeTemplate[];
  selectedTemplate: MemeTemplate | null;
  onSelectTemplate: (template: MemeTemplate) => void;
}

const MemeGallery = ({ 
  templates, 
  selectedTemplate, 
  onSelectTemplate 
}: MemeGalleryProps) => {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-meme-purple to-meme-pink bg-clip-text text-transparent">Choose a Template</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {templates.map((template) => (
          <Card 
            key={template.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
              selectedTemplate?.id === template.id 
                ? 'ring-2 ring-meme-purple shadow-lg shadow-meme-purple/20 scale-[1.02]' 
                : 'hover:scale-105'
            }`}
            onClick={() => onSelectTemplate(template)}
          >
            <CardContent className="p-2 overflow-hidden">
              <div className="relative overflow-hidden rounded">
                <div className="aspect-video flex items-center justify-center bg-muted overflow-hidden">
                  <img 
                    src={template.url} 
                    alt={template.name}
                    className="w-full h-full object-cover transition-all duration-500 hover:scale-110"
                    loading="lazy"
                  />
                </div>
              </div>
              <p className="text-sm mt-2 text-center font-medium truncate">
                {template.name}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MemeGallery;
