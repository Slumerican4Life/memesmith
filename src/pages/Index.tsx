
import React, { useState, useEffect } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MemeGallery from "@/components/MemeGallery";
import MemeEditor from "@/components/MemeEditor";
import MemeCanvas from "@/components/MemeCanvas";
import { MemeTemplate } from "@/types/meme";
import { Separator } from "@/components/ui/separator";

const Index = () => {
  const [templates, setTemplates] = useState<MemeTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<MemeTemplate | null>(null);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [loading, setLoading] = useState(true);
  
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/95">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgc3Ryb2tlPSIjOUI4N0Y1IiBzdHJva2Utb3BhY2l0eT0iLjAyIiBjeD0iMTAwIiBjeT0iMTAwIiByPSI5OCIvPjxwYXRoIGQ9Ik0xMDAgMmM1NiAwIDk4IDQyIDk4IDk4IDAgNTYtNDIgOTgtOTggOTgtNTQgMC05OC00NC05OC05OEMyIDQ0IDQ0IDIgMTAwIDJ6IiBzdHJva2U9IiNEOTQ2RUYiIHN0cm9rZS1vcGFjaXR5PSIuMDIiLz48L2c+PC9zdmc+')]"></div>
      
      <Header />
      
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
                />
                
                {/* Ad placeholder with improved design */}
                <div className="mt-6 bg-gradient-to-br from-meme-darkpurple/20 to-meme-purple/10 p-5 rounded-lg border border-meme-purple/20 text-center relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-meme-purple/0 via-meme-pink/5 to-meme-purple/0 transform translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></div>
                  <p className="font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    Support MemeSmith
                  </p>
                  <p className="text-xs mt-1 text-muted-foreground/70">Our sponsors help keep this service free</p>
                </div>
              </div>
              
              <div>
                <MemeCanvas
                  selectedTemplate={selectedTemplate}
                  topText={topText}
                  bottomText={bottomText}
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
