
import React from 'react';
import { Monitor, Smartphone, LayoutGrid } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useView } from '@/contexts/ViewContext';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const ViewToggle = () => {
  const { viewMode, setViewMode, isInitialized } = useView();
  
  // Don't render anything until fully initialized
  if (!isInitialized) {
    return null;
  }
  
  return (
    <ToggleGroup 
      type="single" 
      value={viewMode} 
      onValueChange={(value) => {
        if (value) setViewMode(value as 'auto' | 'mobile' | 'desktop');
      }}
      className="border border-border rounded-md"
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <ToggleGroupItem value="auto" aria-label="Auto view" className="px-2 data-[state=on]:bg-meme-purple/20">
            <LayoutGrid className="h-4 w-4" />
          </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>
          <p>Auto (Based on device)</p>
        </TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <ToggleGroupItem value="mobile" aria-label="Mobile view" className="px-2 data-[state=on]:bg-meme-purple/20">
            <Smartphone className="h-4 w-4" />
          </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>
          <p>Mobile view</p>
        </TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <ToggleGroupItem value="desktop" aria-label="Desktop view" className="px-2 data-[state=on]:bg-meme-purple/20">
            <Monitor className="h-4 w-4" />
          </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>
          <p>Desktop view</p>
        </TooltipContent>
      </Tooltip>
    </ToggleGroup>
  );
};

export default ViewToggle;
