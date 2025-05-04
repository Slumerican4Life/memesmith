
import React from 'react';
import { MemeTemplate } from '../types/meme';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

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
      <h2 className="text-2xl font-bold mb-6 text-center relative">
        <span className="bg-gradient-to-r from-meme-blue via-meme-purple to-meme-pink bg-clip-text text-transparent inline-block transform transition-all duration-500 hover:scale-105">
          Choose a Template
        </span>
        <span className="absolute top-0 right-1/4 transform -translate-y-1/2">
          <Sparkles size={16} className="text-meme-orange animate-pulse" />
        </span>
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {templates.map((template) => (
          <Card 
            key={template.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
              selectedTemplate?.id === template.id 
                ? 'ring-2 ring-meme-pink shadow-lg shadow-meme-purple/20 scale-[1.02]' 
                : 'hover:scale-105 hover:shadow-md hover:shadow-meme-purple/10'
            }`}
            onClick={() => onSelectTemplate(template)}
          >
            <CardContent className="p-2 overflow-hidden">
              <div className="relative overflow-hidden rounded group">
                <div className="aspect-video flex items-center justify-center bg-muted overflow-hidden">
                  <img 
                    src={template.url} 
                    alt={template.name}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
              <p className={`text-sm mt-2 text-center font-medium truncate transition-all duration-300 ${
                selectedTemplate?.id === template.id 
                  ? 'text-meme-pink' 
                  : 'group-hover:text-meme-purple'
              }`}>
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
