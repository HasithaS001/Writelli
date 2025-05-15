import React, { useState, useRef } from 'react';
import { Editor } from '@tiptap/react';
import ToolbarButton from '../ToolbarButton';
import { useOnClickOutside } from '../hooks/useOnClickOutside';

interface PasteMenuProps {
  editor: Editor;
}

const PasteMenu: React.FC<PasteMenuProps> = ({ editor }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(menuRef as React.RefObject<HTMLElement>, () => {
    setIsOpen(false);
  });

  const handlePaste = async () => {
    try {
      // Get clipboard text
      const text = await navigator.clipboard.readText();
      
      // Insert the text into the editor
      if (text) {
        editor.chain().focus().insertContent(text).run();
      }
      
      setIsOpen(false);
    } catch (error) {
      console.error('Error pasting text:', error);
      // Fallback method if clipboard API fails
      document.execCommand('paste');
    }
  };

  const handlePasteAsPlainText = async () => {
    try {
      // Get clipboard text
      const text = await navigator.clipboard.readText();
      
      // Remove any HTML formatting
      const plainText = text.replace(/<[^>]*>/g, '');
      
      // Insert as plain text
      if (plainText) {
        editor.chain().focus().insertContent(plainText).run();
      }
      
      setIsOpen(false);
    } catch (error) {
      console.error('Error pasting plain text:', error);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <ToolbarButton
        onClick={() => setIsOpen(!isOpen)}
        title="Paste"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
        </svg>
        <span className="ml-1">Paste</span>
      </ToolbarButton>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-48">
          <button
            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center"
            onClick={handlePaste}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
            </svg>
            Paste with Formatting
          </button>
          <button
            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center"
            onClick={handlePasteAsPlainText}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
              <line x1="10" y1="14" x2="14" y2="14"></line>
            </svg>
            Paste as Plain Text
          </button>
        </div>
      )}
    </div>
  );
};

export default PasteMenu;
