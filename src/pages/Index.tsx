
import React, { useState, useEffect } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MemeGallery from "@/components/MemeGallery";
import MemeEditor from "@/components/MemeEditor";
import MemeCanvas from "@/components/MemeCanvas";
import MobileUpload from "@/components/MobileUpload";
import Head from "@/components/Head";
import { MemeTemplate } from "@/types/meme";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Crown, Image, Camera } from "lucide-react";
import AdPlaceholder from "@/components/AdPlaceholder";
import { useView } from '@/contexts/ViewContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from "@/components/ui/button";

const Index = () => {
  const [templates, setTemplates] = useState<MemeTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<MemeTemplate | null>(null);
  const [customImage, setCustomImage] = useState<string | undefined>();
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [loading, setLoading] = useState(true);
  const [effect, setEffect] = useState<'none' | 'glow' | 'golden'>('none');
  const { profile } = useAuth();
  const isPro = profile?.is_pro || false;
  const { viewMode } = useView();
  const isMobile = viewMode === 'mobile';
  
  // Load templates from JSON file
  useEffect(() => {
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
  
  const handleTextChange = (type: 'top' | 'bottom', value: string) => {
    if (type === 'top') {
      setTopText(value);
    } else {
      setBottomText(value);
    }
  };

  // Generate dynamic meta description based on selected template
  const metaDescription = selectedTemplate 
    ? `Create a "${selectedTemplate.name}" meme on MemeSmith - the web's easiest meme generator.` 
    : 'Create, download, and share your own custom memes with MemeSmith - the web\'s easiest meme generator.';

  // Generate dynamic meta image based on selected template
  const metaImage = selectedTemplate ? selectedTemplate.url : 'https://lovable.dev/opengraph-image-p98pqg.png';

  // Render the mobile view
  if (isMobile) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Head 
          title="MemeSmith Editor"
          description={metaDescription}
          image={metaImage}
        />
        
        <Header />
        
        <main className="flex-1 p-4 overflow-y-auto container px-4 mx-auto">
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="w-full grid grid-cols-2 mb-4">
              <TabsTrigger value="upload" className="data-[state=active]:bg-meme-purple/20">
                <Image className="w-4 h-4 mr-2" />
                Upload
              </TabsTrigger>
              <TabsTrigger value="templates" className="data-[state=active]:bg-meme-pink/20">
                <Camera className="w-4 h-4 mr-2" />
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
          
          <MemeEditor
            selectedTemplate={selectedTemplate}
            customImage={customImage}
            topText={topText}
            bottomText={bottomText}
            onTextChange={handleTextChange}
            effect={effect}
            onEffectChange={isPro ? setEffect : undefined}
            compact={true}
          />
          
          <MemeCanvas
            selectedTemplate={selectedTemplate}
            customImage={customImage}
            topText={topText}
            bottomText={bottomText}
            effect={effect}
          />

          {!isPro && (
            <div className="mt-4">
              <AdPlaceholder id="mobile-bottom-ad" format="rectangle" className="mx-auto" />
            </div>
          )}
        </main>
        
        <Footer />
      </div>
    );
  }

  // Render the desktop view
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/95">
      <Head 
        title={selectedTemplate ? `Create ${selectedTemplate.name} Meme` : undefined}
        description={metaDescription}
        image={metaImage}
      />
      
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgc3Ryb2tlPSIjOUI4N0Y1IiBzdHJva2Utb3BhY2l0eT0iLjAyIiBjeD0iMTAwIiBjeT0iMTAwIiByPSI5OCIvPjxwYXRoIGQ9Ik0xMDAgMmM1NiAwIDk4IDQyIDk4IDk4IDAgNTYtNDIgOTgtOTggOTgtNTQgMC05OC00NC05OC05OEMyIDQ0IDQ0IDIgMTAwIDJ6IiBzdHJva2U9IiNEOTQ2RUYiIHN0cm9rZS1vcGFjaXR5PSIuMDIiLz48L2c+PC9zdmc+')]"></div>
      
      <Header />

      {/* Top Banner Ad - Desktop only */}
      <div className="container px-4 mx-auto mt-4">
        <AdPlaceholder id="home-top-banner" className="mx-auto mb-6" />
      </div>
      
      <main className="container px-4 mx-auto flex-1 py-8 relative z-10">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-t-transparent border-meme-purple rounded-full animate-spin"></div>
              <p className="mt-4 text-xl font-medium bg-gradient-to-r from-meme-purple to-meme-pink bg-clip-text text-transparent">Loading meme templates...</p>
            </div>
          </div>
        ) : (
          <>
            {isPro && (
              <div className="mb-4">
                <Badge className="bg-gradient-to-r from-meme-purple to-meme-pink border-none">
                  <Crown className="h-3 w-3 mr-1" /> Pro Account
                </Badge>
                <span className="ml-2 text-sm text-muted-foreground">
                  You have access to premium features!
                </span>
              </div>
            )}

            <Tabs defaultValue="templates" className="w-full">
              <TabsList className="w-full max-w-md mx-auto mb-6">
                <TabsTrigger value="templates" className="data-[state=active]:bg-meme-purple/20 flex-1">
                  <Camera className="w-4 h-4 mr-2" />
                  Meme Templates
                </TabsTrigger>
                <TabsTrigger value="upload" className="data-[state=active]:bg-meme-pink/20 flex-1">
                  <Image className="w-4 h-4 mr-2" />
                  Upload Your Image
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="templates" className="mt-0">
                <MemeGallery 
                  templates={templates}
                  selectedTemplate={selectedTemplate}
                  onSelectTemplate={handleTemplateSelected}
                />
              </TabsContent>
              
              <TabsContent value="upload" className="mt-0">
                <div className="max-w-xl mx-auto">
                  <div className="p-6 bg-gradient-to-br from-card to-card/80 rounded-lg border border-meme-purple/20 shadow-lg">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-meme-blue to-meme-purple bg-clip-text text-transparent mb-4">Upload Your Own Image</h2>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Button 
                        variant="outline"
                        className="flex flex-col items-center justify-center py-8 h-auto border-meme-purple/30 hover:border-meme-purple/70 hover:bg-meme-purple/5 transition-all"
                        onClick={() => {
                          // Simulate click on hidden file input
                          document.getElementById('desktop-file-upload')?.click();
                        }}
                      >
                        <Image className="h-8 w-8 mb-3 text-meme-purple" />
                        <span>Upload from Library</span>
                      </Button>
                      
                      <Button 
                        variant="outline"
                        className="flex flex-col items-center justify-center py-8 h-auto border-meme-pink/30 hover:border-meme-pink/70 hover:bg-meme-pink/5 transition-all"
                        onClick={() => {
                          // Simulate click on hidden camera input
                          document.getElementById('desktop-camera-upload')?.click();
                        }}
                      >
                        <Camera className="h-8 w-8 mb-3 text-meme-pink" />
                        <span>Take Photo</span>
                      </Button>
                    </div>
                    
                    <input
                      id="desktop-file-upload"
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (!file) return;
                        
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          const result = e.target?.result as string;
                          if (result) {
                            handleImageSelected(result);
                          }
                        };
                        reader.readAsDataURL(file);
                      }}
                      className="hidden"
                    />
                    
                    <input
                      id="desktop-camera-upload"
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (!file) return;
                        
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          const result = e.target?.result as string;
                          if (result) {
                            handleImageSelected(result);
                          }
                        };
                        reader.readAsDataURL(file);
                      }}
                      className="hidden"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <Separator className="my-8 bg-gradient-to-r from-transparent via-meme-purple/30 to-transparent h-[1px]" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <MemeEditor
                  selectedTemplate={selectedTemplate}
                  customImage={customImage}
                  topText={topText}
                  bottomText={bottomText}
                  onTextChange={handleTextChange}
                  effect={effect}
                  onEffectChange={isPro ? setEffect : undefined}
                />
                
                {/* Ad placeholder - only shown for free users */}
                {!isPro && (
                  <div className="mt-6">
                    <AdPlaceholder id="editor-bottom-ad" format="rectangle" className="mx-auto" />
                  </div>
                )}
              </div>
              
              <div>
                <MemeCanvas
                  selectedTemplate={selectedTemplate}
                  customImage={customImage}
                  topText={topText}
                  bottomText={bottomText}
                  effect={effect}
                />
              </div>
            </div>
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
