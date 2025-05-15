import React, { useState, useRef } from 'react';
import { Editor } from '@tiptap/react';
import ToolbarButton from '../ToolbarButton';
import { useOnClickOutside } from '../hooks/useOnClickOutside';

interface ColorMenuProps {
  editor: Editor;
}

const colors = [
  { name: 'Default', color: 'inherit' },
  { name: 'Black', color: '#000000' },
  { name: 'Gray', color: '#718096' },
  { name: 'Red', color: '#E53E3E' },
  { name: 'Orange', color: '#ED8936' },
  { name: 'Yellow', color: '#ECC94B' },
  { name: 'Green', color: '#48BB78' },
  { name: 'Teal', color: '#38B2AC' },
  { name: 'Blue', color: '#4299E1' },
  { name: 'Indigo', color: '#667EEA' },
  { name: 'Purple', color: '#9F7AEA' },
  { name: 'Pink', color: '#ED64A6' },
];

const ColorMenu: React.FC<ColorMenuProps> = ({ editor }) => {
  const [isTextColorOpen, setIsTextColorOpen] = useState(false);
  const [isHighlightOpen, setIsHighlightOpen] = useState(false);
  const textColorRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(textColorRef as React.RefObject<HTMLElement>, () => setIsTextColorOpen(false));
  useOnClickOutside(highlightRef as React.RefObject<HTMLElement>, () => setIsHighlightOpen(false));

  const setTextColor = (color: string) => {
    if (color === 'inherit') {
      editor.chain().focus().unsetColor().run();
    } else {
      editor.chain().focus().setColor(color).run();
    }
    setIsTextColorOpen(false);
  };

  const setHighlightColor = (color: string) => {
    if (color === 'inherit') {
      editor.chain().focus().unsetHighlight().run();
    } else {
      editor.chain().focus().setHighlight({ color }).run();
    }
    setIsHighlightOpen(false);
  };

  return (
    <div className="flex items-center">
      <div className="relative" ref={textColorRef}>
        <ToolbarButton
          onClick={() => {
            setIsTextColorOpen(!isTextColorOpen);
            setIsHighlightOpen(false);
          }}
          title="Text Color"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 7h6l-3 10-3-10z"></path>
            <line x1="4" y1="20" x2="20" y2="20"></line>
          </svg>
        </ToolbarButton>

        {isTextColorOpen && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-40 p-2">
            <div className="grid grid-cols-4 gap-1">
              {colors.map((color) => (
                <button
                  key={color.color}
                  className="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center"
                  style={{ backgroundColor: color.color === 'inherit' ? 'white' : color.color }}
                  onClick={() => setTextColor(color.color)}
                  title={color.name}
                >
                  {color.color === 'inherit' && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="5" x2="19" y2="19"></line>
                      <line x1="19" y1="5" x2="5" y2="19"></line>
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="relative" ref={highlightRef}>
        <ToolbarButton
          onClick={() => {
            setIsHighlightOpen(!isHighlightOpen);
            setIsTextColorOpen(false);
          }}
          title="Highlight Color"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l.642.642a7.5 7.5 0 0 1 0 10.606l-8.284 8.284a2 2 0 0 1-2.828 0l-.707-.707a2 2 0 0 1 0-2.828l8.284-8.284a7.5 7.5 0 0 1 10.606 0L12 2z"></path>
            <path d="M7 15l-1.5 1.5"></path>
            <path d="M3.5 19.5L5 18"></path>
            <path d="M19 3l-1.5 1.5"></path>
            <path d="M15 7l1.5-1.5"></path>
            <path d="M18 18l1.5-1.5"></path>
            <path d="M15 18l1.5 1.5"></path>
          </svg>
        </ToolbarButton>

        {isHighlightOpen && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-40 p-2">
            <div className="grid grid-cols-4 gap-1">
              {colors.map((color) => (
                <button
                  key={color.color}
                  className="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center"
                  style={{ backgroundColor: color.color === 'inherit' ? 'white' : color.color }}
                  onClick={() => setHighlightColor(color.color)}
                  title={color.name}
                >
                  {color.color === 'inherit' && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="5" x2="19" y2="19"></line>
                      <line x1="19" y1="5" x2="5" y2="19"></line>
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorMenu;
