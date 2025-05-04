
import React from 'react';
import { MemeTemplate } from '../types/meme';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles } from 'lucide-react';

interface MemeGalleryProps {
  templates: MemeTemplate[];
  selectedTemplate: MemeTemplate | null;
  onSelectTemplate: (template: MemeTemplate) => void;
  compact?: boolean;
}

const MemeGallery = ({ 
  templates, 
  selectedTemplate, 
  onSelectTemplate,
  compact = false 
}: MemeGalleryProps) => {
  return (
    <div className={compact ? "pb-2" : "pb-6"}>
      <div className="flex items-center mb-4">
        <h2 className={`${compact ? "text-xl" : "text-3xl"} font-bold bg-gradient-to-r from-meme-blue to-meme-purple bg-clip-text text-transparent`}>
          Choose a Meme Template
        </h2>
        <Sparkles size={compact ? 16 : 24} className="ml-2 text-meme-orange" />
      </div>
      
      <ScrollArea className={`w-full ${compact ? "h-[240px]" : "h-[320px]"}`}>
        <div 
          className={`grid grid-cols-3 ${compact ? "sm:grid-cols-4 md:grid-cols-6 gap-2" : "sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4"}`}
        >
          {templates.map((template) => (
            <Card 
              key={template.id}
              className={`
                group overflow-hidden relative cursor-pointer transition-all duration-300 hover-lift
                ${selectedTemplate?.id === template.id 
                  ? 'ring-2 ring-meme-pink ring-offset-2 ring-offset-background shadow-lg' 
                  : 'hover:shadow-md'}
              `}
              onClick={() => onSelectTemplate(template)}
            >
              <div className="aspect-square overflow-hidden">
                <img 
                  src={template.url} 
                  alt={template.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              
              {!compact && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-xs text-white text-center font-medium truncate">
                    {template.name}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MemeGallery;
