import React, { useState, useEffect } from 'react';
import { ChevronLeft, Image, Upload, Monitor, LayoutGrid, Smartphone } from 'lucide-react';
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
import { useView } from '@/contexts/ViewContext';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

// Create a memoized component for better performance
const MobileMeme = React.memo(() => {
  const navigate = useNavigate();
  const { viewMode, setViewMode } = useView();
  const [customImage, setCustomImage] = useState<string | undefined>();
  const [templates, setTemplates] = useState<MemeTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<MemeTemplate | null>(null);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [loading, setLoading] = useState(true);
  const [effect, setEffect] = useState<'none' | 'glow' | 'golden'>('none');
  const { profile } = useAuth();
  const isPro = profile?.is_pro || false;
  
  // Load templates from JSON file - use an effect with proper cleanup
  useEffect(() => {
    let isMounted = true;
    
    const loadTemplates = async () => {
      if (!isMounted) return;
      
      try {
        const response = await fetch('/memeTemplates.json');
        if (!response.ok) throw new Error(`Failed to load templates: ${response.status}`);
        
        const data: MemeTemplate[] = await response.json();
        
        if (isMounted) {
          setTemplates(data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error loading meme templates:", error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    loadTemplates();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
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

  // Use stable callbacks with useCallback to prevent unnecessary re-renders
  const handleViewModeChange = React.useCallback((value: string) => {
    if (value === 'desktop') {
      setViewMode('desktop');
    } else if (value === 'mobile') {
      setViewMode('mobile');
    }
  }, [setViewMode]);
  
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

        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          {/* Modified view toggle to only use desktop/mobile options */}
          <ToggleGroup 
            type="single" 
            value={viewMode} 
            onValueChange={handleViewModeChange}
            className="border border-border rounded-md"
          >
            <ToggleGroupItem value="mobile" aria-label="Mobile view" className="p-1 h-8 w-8">
              <Smartphone className="h-3.5 w-3.5" />
            </ToggleGroupItem>
            <ToggleGroupItem value="desktop" aria-label="Desktop view" className="p-1 h-8 w-8">
              <Monitor className="h-3.5 w-3.5" />
            </ToggleGroupItem>
          </ToggleGroup>
          
          {isPro && (
            <ProBadge size="sm" />
          )}
        </div>
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
});

// Give the component a display name for better debugging
MobileMeme.displayName = 'MobileMeme';

export default MobileMeme;
