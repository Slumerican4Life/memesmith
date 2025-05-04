
import React, { useState } from 'react';
import { ChevronLeft, Image, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MobileUpload from '@/components/MobileUpload';
import { MemeTemplate } from '@/types/meme';
import MemeCanvas from '@/components/MemeCanvas';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MemeGallery from "@/components/MemeGallery";
import { useIsMobile } from '@/hooks/use-mobile';

const MobileMeme = () => {
  const navigate = useNavigate();
  const [customImage, setCustomImage] = useState<string | undefined>();
  const [templates, setTemplates] = useState<MemeTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<MemeTemplate | null>(null);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();
  
  // Load templates from JSON file
  React.useEffect(() => {
    const loadTemplates = async () => {
      try {
        const response = await fetch('/memeTemplates.json');
        const data: MemeTemplate[] = await response.json();
        setTemplates(data);
        setLoading(false);
      } catch (error) {
        console.error("Error loading meme templates:", error);
        setLoading(false);
      }
    };
    
    loadTemplates();
  }, []);
  
  const handleImageSelected = (imageData: string) => {
    setCustomImage(imageData);
    setSelectedTemplate(null);
  };
  
  const handleTemplateSelected = (template: MemeTemplate) => {
    setSelectedTemplate(template);
    setCustomImage(undefined);
  };
  
  const handleBackClick = () => {
    navigate('/');
  };

  // Redirect to index page if not on mobile
  React.useEffect(() => {
    if (!isMobile) {
      navigate('/');
    }
  }, [isMobile, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Simplified header for mobile */}
      <header className="p-4 border-b border-border relative">
        <Button 
          variant="ghost" 
          size="sm" 
          className="absolute left-2 top-1/2 transform -translate-y-1/2"
          onClick={handleBackClick}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-center text-xl font-bold bg-gradient-to-r from-meme-purple to-meme-pink bg-clip-text text-transparent">
          MemeSmith Mobile
        </h1>
      </header>
      
      <main className="flex-1 p-4 overflow-y-auto">
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="upload" className="data-[state=active]:bg-meme-purple/20">
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="templates" className="data-[state=active]:bg-meme-pink/20">
              <Image className="w-4 h-4 mr-2" />
              Templates
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="mt-2 min-h-[200px]">
            <MobileUpload onImageSelected={handleImageSelected} />
          </TabsContent>
          
          <TabsContent value="templates" className="mt-2 min-h-[200px]">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 border-4 border-t-transparent border-meme-purple rounded-full animate-spin"></div>
                  <p className="mt-3 text-sm font-medium text-muted-foreground">Loading templates...</p>
                </div>
              </div>
            ) : (
              <div className="pb-4">
                <MemeGallery 
                  templates={templates}
                  selectedTemplate={selectedTemplate}
                  onSelectTemplate={handleTemplateSelected}
                  compact={true}
                />
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 pb-20">
          <MemeCanvas
            selectedTemplate={selectedTemplate}
            customImage={customImage}
            topText={topText}
            bottomText={bottomText}
          />
        </div>
      </main>
    </div>
  );
};

export default MobileMeme;
