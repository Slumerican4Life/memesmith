import React, { useState } from 'react';
import { ChevronLeft, Image, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MobileUpload from '@/components/MobileUpload';
import { MemeTemplate } from '@/types/meme';
import MemeCanvas from '@/components/MemeCanvas';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MemeGallery from "@/components/MemeGallery";
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ProBadge from '@/components/ProBadge';
import Head from '@/components/Head';

const MobileMeme = () => {
  const navigate = useNavigate();
  const [customImage, setCustomImage] = useState<string | undefined>();
  const [templates, setTemplates] = useState<MemeTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<MemeTemplate | null>(null);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [loading, setLoading] = useState(true);
  const [effect, setEffect] = useState<'none' | 'glow' | 'golden'>('none');
  const { profile } = useAuth();
  const isPro = profile?.is_pro || false;
  
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
  
  // Generate dynamic meta description based on selected template
  const metaDescription = selectedTemplate 
    ? `Create a "${selectedTemplate.name}" meme on MemeSmith - the web's easiest meme generator.` 
    : 'Create mobile memes with MemeSmith - the web\'s easiest meme generator.';

  // Generate dynamic meta image based on selected template
  const metaImage = selectedTemplate ? selectedTemplate.url : 'https://lovable.dev/opengraph-image-p98pqg.png';
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Head 
        title="MemeSmith Mobile Editor"
        description={metaDescription}
        image={metaImage}
      />
      
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
        {isPro && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <ProBadge size="sm" />
          </div>
        )}
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
        
        <div className="mt-4 space-y-4">
          {(selectedTemplate || customImage) && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="topText">Top Text</Label>
                <Input
                  id="topText"
                  value={topText}
                  onChange={(e) => setTopText(e.target.value)}
                  placeholder="Enter top text"
                />
              </div>
              
              <div>
                <Label htmlFor="bottomText">Bottom Text</Label>
                <Input
                  id="bottomText"
                  value={bottomText}
                  onChange={(e) => setBottomText(e.target.value)}
                  placeholder="Enter bottom text"
                />
              </div>
              
              {isPro && (
                <div>
                  <div className="flex items-center mb-2">
                    <Label className="text-sm font-medium flex items-center">
                      Pro Effects
                      <ProBadge size="sm" className="ml-2" />
                    </Label>
                  </div>
                  
                  <RadioGroup
                    value={effect}
                    onValueChange={(value) => setEffect(value as 'none' | 'glow' | 'golden')}
                    className="flex items-center space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="none" id="m-effect-none" />
                      <Label htmlFor="m-effect-none" className="text-sm">None</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="glow" id="m-effect-glow" />
                      <Label htmlFor="m-effect-glow" className="text-sm">Glow</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="golden" id="m-effect-golden" />
                      <Label htmlFor="m-effect-golden" className="text-sm">Golden</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}
            </div>
          )}
          
          <MemeCanvas
            selectedTemplate={selectedTemplate}
            customImage={customImage}
            topText={topText}
            bottomText={bottomText}
            effect={effect}
          />
        </div>
      </main>
    </div>
  );
};

export default MobileMeme;
