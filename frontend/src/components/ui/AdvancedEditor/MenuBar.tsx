import React from 'react';
import { Editor } from '@tiptap/react';
import TextFormatMenu from './menus/TextFormatMenu';
import ParagraphMenu from './menus/ParagraphMenu';
import AlignmentMenu from './menus/AlignmentMenu';
import ListMenu from './menus/ListMenu';
import InsertMenu from './menus/InsertMenu';
import PasteMenu from './menus/PasteMenu';
import ColorMenu from './menus/ColorMenu';

interface MenuBarProps {
  editor: Editor | null;
}

const MenuBar: React.FC<MenuBarProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="border-b border-gray-200 bg-gray-50 p-1 flex flex-wrap items-center gap-1 text-black">
      <InsertMenu editor={editor} />
      <div className="h-6 w-px bg-gray-300 mx-1"></div>
      
      <PasteMenu editor={editor} />
      <div className="h-6 w-px bg-gray-300 mx-1"></div>
      
      <TextFormatMenu editor={editor} />
      <div className="h-6 w-px bg-gray-300 mx-1"></div>
      
      <ParagraphMenu editor={editor} />
      <div className="h-6 w-px bg-gray-300 mx-1"></div>
      
      <AlignmentMenu editor={editor} />
      <div className="h-6 w-px bg-gray-300 mx-1"></div>
      
      <ListMenu editor={editor} />
      <div className="h-6 w-px bg-gray-300 mx-1"></div>
      
      <ColorMenu editor={editor} />
    </div>
  );
};

export default MenuBar;
