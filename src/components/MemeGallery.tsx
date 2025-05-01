
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
      <h2 className="text-xl font-bold mb-4">Choose a Template</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {templates.map((template) => (
          <Card 
            key={template.id}
            className={`cursor-pointer transition-all hover:scale-105 ${
              selectedTemplate?.id === template.id 
                ? 'ring-2 ring-primary' 
                : ''
            }`}
            onClick={() => onSelectTemplate(template)}
          >
            <CardContent className="p-2">
              <img 
                src={template.url} 
                alt={template.name}
                className="w-full h-auto object-cover rounded"
              />
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
