import React, { useState, useRef } from 'react';
import { Editor } from '@tiptap/react';
import ToolbarButton from '../ToolbarButton';
import { useOnClickOutside } from '../hooks/useOnClickOutside';

interface ParagraphMenuProps {
  editor: Editor;
}

const ParagraphMenu: React.FC<ParagraphMenuProps> = ({ editor }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(menuRef as React.RefObject<HTMLElement>, () => setIsOpen(false));

  const getCurrentHeadingLabel = () => {
    if (editor.isActive('heading', { level: 1 })) return 'Heading 1';
    if (editor.isActive('heading', { level: 2 })) return 'Heading 2';
    if (editor.isActive('heading', { level: 3 })) return 'Heading 3';
    if (editor.isActive('heading', { level: 4 })) return 'Heading 4';
    if (editor.isActive('heading', { level: 5 })) return 'Heading 5';
    if (editor.isActive('heading', { level: 6 })) return 'Heading 6';
    if (editor.isActive('paragraph')) return 'Paragraph';
    return 'Paragraph';
  };

  return (
    <div className="relative" ref={menuRef}>
      <ToolbarButton
        onClick={() => setIsOpen(!isOpen)}
        isActive={false}
        title="Paragraph Format"
        className="min-w-[120px] flex items-center justify-between"
      >
        <span className="text-sm">{getCurrentHeadingLabel()}</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </ToolbarButton>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-40">
          <button
            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${editor.isActive('paragraph') ? 'bg-blue-50 text-blue-700' : ''}`}
            onClick={() => {
              editor.chain().focus().setParagraph().run();
              setIsOpen(false);
            }}
          >
            Paragraph
          </button>
          <button
            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${editor.isActive('heading', { level: 1 }) ? 'bg-blue-50 text-blue-700' : ''}`}
            onClick={() => {
              editor.chain().focus().toggleHeading({ level: 1 }).run();
              setIsOpen(false);
            }}
          >
            <span className="font-bold">Heading 1</span>
          </button>
          <button
            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-50 text-blue-700' : ''}`}
            onClick={() => {
              editor.chain().focus().toggleHeading({ level: 2 }).run();
              setIsOpen(false);
            }}
          >
            <span className="font-bold">Heading 2</span>
          </button>
          <button
            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${editor.isActive('heading', { level: 3 }) ? 'bg-blue-50 text-blue-700' : ''}`}
            onClick={() => {
              editor.chain().focus().toggleHeading({ level: 3 }).run();
              setIsOpen(false);
            }}
          >
            <span className="font-bold">Heading 3</span>
          </button>
          <button
            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${editor.isActive('heading', { level: 4 }) ? 'bg-blue-50 text-blue-700' : ''}`}
            onClick={() => {
              editor.chain().focus().toggleHeading({ level: 4 }).run();
              setIsOpen(false);
            }}
          >
            <span className="font-bold">Heading 4</span>
          </button>
          <button
            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${editor.isActive('heading', { level: 5 }) ? 'bg-blue-50 text-blue-700' : ''}`}
            onClick={() => {
              editor.chain().focus().toggleHeading({ level: 5 }).run();
              setIsOpen(false);
            }}
          >
            <span className="font-bold">Heading 5</span>
          </button>
          <button
            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${editor.isActive('heading', { level: 6 }) ? 'bg-blue-50 text-blue-700' : ''}`}
            onClick={() => {
              editor.chain().focus().toggleHeading({ level: 6 }).run();
              setIsOpen(false);
            }}
          >
            <span className="font-bold">Heading 6</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ParagraphMenu;
