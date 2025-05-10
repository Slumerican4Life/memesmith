
import React, { useState } from 'react';
import { MemeTemplate } from '../types/meme';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, Lock, Image } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import ProBadge from '@/components/ProBadge';

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
  const navigate = useNavigate();
  const { profile } = useAuth();
  const isPro = profile?.is_pro || false;
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({});
  
  const handleTemplateClick = (template: MemeTemplate) => {
    // Check if template is pro-only and user is not pro
    if (template.pro_only && !isPro) {
      toast({
        title: "Pro Template",
        description: "This template is only available for Pro users. Upgrade to unlock!",
        variant: "default",
      });
      navigate('/upgrade');
      return;
    }
    
    onSelectTemplate(template);
  };

  // Function to handle image loading errors
  const handleImageError = (templateId: string) => {
    setImageErrors(prev => ({
      ...prev,
      [templateId]: true
    }));
    console.error(`Error loading image for template: ${templateId}`);
  };
  
  // Placeholder images from Unsplash
  const placeholderImages = [
    "https://images.unsplash.com/photo-1518770660439-4636190af475",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb",
    "https://images.unsplash.com/photo-1500673922987-e212871fec22",
    "https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
  ];
  
  // Function to get a placeholder image based on template id
  const getPlaceholderImage = (templateId: string) => {
    // Use the template id to deterministically pick a placeholder
    const index = templateId.charCodeAt(0) % placeholderImages.length;
    return placeholderImages[index];
  };
  
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
                ${template.pro_only && !isPro ? 'opacity-80' : ''}
              `}
              onClick={() => handleTemplateClick(template)}
            >
              <div className="aspect-square overflow-hidden">
                {imageErrors[template.id] ? (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-meme-purple/20 to-meme-pink/20">
                    <Image className="h-8 w-8 text-muted-foreground" />
                    <span className="sr-only">{template.name}</span>
                  </div>
                ) : (
                  <img 
                    src={template.url || getPlaceholderImage(template.id)} 
                    alt={template.name}
                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${template.pro_only && !isPro ? 'filter blur-[1px]' : ''}`}
                    loading="lazy"
                    onError={() => handleImageError(template.id)}
                  />
                )}
              </div>
              
              {!compact && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-xs text-white text-center font-medium truncate">
                    {template.name}
                  </p>
                </div>
              )}
              
              {template.pro_only && (
                <div className="absolute top-2 right-2 z-10">
                  {isPro ? (
                    <ProBadge size="sm" />
                  ) : (
                    <div className="bg-background/90 backdrop-blur-sm p-1 rounded-full">
                      <Lock className="h-4 w-4 text-meme-purple" />
                    </div>
                  )}
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
