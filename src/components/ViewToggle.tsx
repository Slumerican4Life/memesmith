
import React from 'react';
import { Monitor, Smartphone, LayoutGrid } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useView } from '@/contexts/ViewContext';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const ViewToggle = () => {
  const { viewMode, setViewMode } = useView();
  
  return (
    <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'auto' | 'mobile' | 'desktop')}>
      <Tooltip>
        <TooltipTrigger asChild>
          <ToggleGroupItem value="auto" aria-label="Auto view" className="px-2">
            <LayoutGrid className="h-4 w-4" />
          </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>
          <p>Auto (Based on device)</p>
        </TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <ToggleGroupItem value="mobile" aria-label="Mobile view" className="px-2">
            <Smartphone className="h-4 w-4" />
          </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>
          <p>Mobile view</p>
        </TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <ToggleGroupItem value="desktop" aria-label="Desktop view" className="px-2">
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
