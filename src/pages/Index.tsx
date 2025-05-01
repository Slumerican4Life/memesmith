
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
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="container px-4 mx-auto flex-1 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-xl font-medium">Loading meme templates...</p>
          </div>
        ) : (
          <>
            <MemeGallery 
              templates={templates}
              selectedTemplate={selectedTemplate}
              onSelectTemplate={setSelectedTemplate}
            />
            
            <Separator className="my-8" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <MemeEditor
                  selectedTemplate={selectedTemplate}
                  topText={topText}
                  bottomText={bottomText}
                  onTextChange={handleTextChange}
                />
                
                {/* Ad placeholder */}
                <div className="mt-6 bg-card p-4 rounded-lg border border-dashed border-muted-foreground text-center">
                  <p className="text-muted-foreground">
                    Advertisement Placeholder
                  </p>
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
