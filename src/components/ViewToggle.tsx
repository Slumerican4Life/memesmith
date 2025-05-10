
import React from 'react';
import { Smartphone } from "lucide-react";

const ViewToggle = () => {
  return (
    <div className="flex items-center justify-center gap-2 px-2 py-1 border border-border rounded-md bg-meme-purple/10">
      <div className="flex items-center gap-1">
        <Smartphone className="h-4 w-4" />
        <span className="text-xs font-medium">Mobile</span>
      </div>
    </div>
  );
};

export default ViewToggle;
