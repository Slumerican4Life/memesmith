
import React, { useState, useEffect, useRef } from 'react';
import { Palette } from 'lucide-react';

interface TextPosition {
  x: number;
  y: number;
}

interface DraggableTextProps {
  initialText: string;
  initialPosition: TextPosition;
  onTextChange: (text: string) => void;
  onPositionChange: (position: TextPosition) => void;
  color?: string;
}

const DraggableText: React.FC<DraggableTextProps> = ({
  initialText,
  initialPosition,
  onTextChange,
  onPositionChange,
  color = 'white'
}) => {
  const [text, setText] = useState(initialText);
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [textColor, setTextColor] = useState(color);
  
  const textRef = useRef<HTMLDivElement>(null);
  const colors = ['white', '#ffff00', '#ff6b6b', '#4ecdc4', '#a29bfe', '#ff9a8b', '#6ab04c'];
  
  // Update parent when text changes
  useEffect(() => {
    onTextChange(text);
  }, [text, onTextChange]);
  
  // Update parent when position changes
  useEffect(() => {
    onPositionChange(position);
  }, [position, onPositionChange]);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const parent = textRef.current?.parentElement;
    
    if (parent) {
      const parentRect = parent.getBoundingClientRect();
      const x = touch.clientX - parentRect.left;
      const y = touch.clientY - parentRect.top;
      
      setPosition({ x, y });
    }
  };
  
  const handleTouchEnd = () => {
    setIsDragging(false);
  };
  
  const handleDoubleTap = () => {
    setShowControls(!showControls);
  };
  
  const handleColorChange = (newColor: string) => {
    setTextColor(newColor);
    setShowControls(false);
  };
  
  return (
    <div 
      ref={textRef}
      className="absolute touch-manipulation select-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: isDragging ? 1000 : 100,
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onDoubleClick={handleDoubleTap}
    >
      <div 
        className="meme-text max-w-[90vw] text-center whitespace-pre-wrap break-words"
        style={{ color: textColor }}
      >
        {text || 'Double tap to edit'}
      </div>
      
      {/* Text controls */}
      {showControls && (
        <div className="absolute top-full left-0 mt-2 bg-background/80 backdrop-blur-sm border border-meme-purple/30 rounded-lg p-2 shadow-lg z-[1001]">
          <div className="flex gap-1 mb-2 items-center">
            <Palette size={16} className="text-muted-foreground" />
            <div className="flex gap-1">
              {colors.map((c) => (
                <button
                  key={c}
                  className="w-5 h-5 rounded-full hover:scale-110 transition-transform"
                  style={{ backgroundColor: c, border: c === textColor ? '2px solid white' : 'none' }}
                  onClick={() => handleColorChange(c)}
                />
              ))}
            </div>
          </div>
          
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full text-sm bg-background border border-meme-purple/20 rounded p-2 focus:ring-1 focus:ring-meme-purple/50 focus:outline-none"
            onClick={(e) => e.stopPropagation()}
            rows={2}
            placeholder="Enter text..."
          />
        </div>
      )}
    </div>
  );
};

export default DraggableText;
