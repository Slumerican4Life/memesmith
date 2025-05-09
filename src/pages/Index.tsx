
import React, { useState, useEffect } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MemeGallery from "@/components/MemeGallery";
import MemeEditor from "@/components/MemeEditor";
import MemeCanvas from "@/components/MemeCanvas";
import Head from "@/components/Head";
import { MemeTemplate } from "@/types/meme";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Crown } from "lucide-react";
import AdPlaceholder from "@/components/AdPlaceholder";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [templates, setTemplates] = useState<MemeTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<MemeTemplate | null>(null);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [loading, setLoading] = useState(true);
  const [effect, setEffect] = useState<'none' | 'glow' | 'golden'>('none');
  const { profile } = useAuth();
  const isPro = profile?.is_pro || false;
  const isMobile = useIsMobile();
  
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
      {!isMobile && (
        <div className="container px-4 mx-auto mt-4">
          <AdPlaceholder id="home-top-banner" className="mx-auto mb-6" />
        </div>
      )}
      
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
            
            <MemeGallery 
              templates={templates}
              selectedTemplate={selectedTemplate}
              onSelectTemplate={setSelectedTemplate}
            />
            
            <Separator className="my-10 bg-gradient-to-r from-transparent via-meme-purple/30 to-transparent h-[1px]" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <MemeEditor
                  selectedTemplate={selectedTemplate}
                  topText={topText}
                  bottomText={bottomText}
                  onTextChange={handleTextChange}
                  effect={effect}
                  onEffectChange={isPro ? setEffect : undefined}
                />
                
                {/* Ad placeholder - only shown for free users */}
                {!isPro && !isMobile && (
                  <div className="mt-6">
                    <AdPlaceholder id="editor-bottom-ad" format="rectangle" className="mx-auto" />
                  </div>
                )}
              </div>
              
              <div>
                <MemeCanvas
                  selectedTemplate={selectedTemplate}
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
