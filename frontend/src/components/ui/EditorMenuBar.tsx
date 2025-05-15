import React from 'react';
import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link,
  Image,
  Table,
  Code,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  Highlighter,
  Palette,
} from 'lucide-react';

interface MenuBarProps {
  editor: Editor | null;
}

const MenuBar: React.FC<MenuBarProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('Enter the URL of the image:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter the URL:', previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  return (
    <div className="border-b border-gray-200 bg-white rounded-t-lg p-2 flex flex-wrap gap-1 sticky top-0 z-10">
      <div className="flex items-center space-x-1 mr-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-2 rounded-md transition-colors ${
            editor.isActive('bold') ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
          }`}
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-2 rounded-md transition-colors ${
            editor.isActive('italic') ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
          }`}
          title="Italic"
        >
          <Italic size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded-md transition-colors ${
            editor.isActive('underline') ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
          }`}
          title="Underline"
        >
          <Underline size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`p-2 rounded-md transition-colors ${
            editor.isActive('strike') ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
          }`}
          title="Strikethrough"
        >
          <Strikethrough size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={`p-2 rounded-md transition-colors ${
            editor.isActive('highlight') ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
          }`}
          title="Highlight"
        >
          <Highlighter size={16} />
        </button>
      </div>

      <div className="h-6 w-px bg-gray-300 mx-1"></div>

      <div className="flex items-center space-x-1 mr-2">
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded-md transition-colors ${
            editor.isActive('heading', { level: 1 }) ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
          }`}
          title="Heading 1"
        >
          <Heading1 size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded-md transition-colors ${
            editor.isActive('heading', { level: 2 }) ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
          }`}
          title="Heading 2"
        >
          <Heading2 size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded-md transition-colors ${
            editor.isActive('heading', { level: 3 }) ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
          }`}
          title="Heading 3"
        >
          <Heading3 size={16} />
        </button>
      </div>

      <div className="h-6 w-px bg-gray-300 mx-1"></div>

      <div className="flex items-center space-x-1 mr-2">
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-md transition-colors ${
            editor.isActive('bulletList') ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
          }`}
          title="Bullet List"
        >
          <List size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded-md transition-colors ${
            editor.isActive('orderedList') ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
          }`}
          title="Ordered List"
        >
          <ListOrdered size={16} />
        </button>
      </div>

      <div className="h-6 w-px bg-gray-300 mx-1"></div>

      <div className="flex items-center space-x-1 mr-2">
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 rounded-md transition-colors ${
            editor.isActive({ textAlign: 'left' }) ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
          }`}
          title="Align Left"
        >
          <AlignLeft size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 rounded-md transition-colors ${
            editor.isActive({ textAlign: 'center' }) ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
          }`}
          title="Align Center"
        >
          <AlignCenter size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-2 rounded-md transition-colors ${
            editor.isActive({ textAlign: 'right' }) ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
          }`}
          title="Align Right"
        >
          <AlignRight size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={`p-2 rounded-md transition-colors ${
            editor.isActive({ textAlign: 'justify' }) ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
          }`}
          title="Justify"
        >
          <AlignJustify size={16} />
        </button>
      </div>

      <div className="h-6 w-px bg-gray-300 mx-1"></div>

      <div className="flex items-center space-x-1 mr-2">
        <button
          onClick={setLink}
          className={`p-2 rounded-md transition-colors ${
            editor.isActive('link') ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
          }`}
          title="Link"
        >
          <Link size={16} />
        </button>
        <button
          onClick={addImage}
          className="p-2 rounded-md transition-colors text-gray-700 hover:bg-gray-100"
          title="Image"
        >
          <Image size={16} />
        </button>
        <button
          onClick={addTable}
          className={`p-2 rounded-md transition-colors ${
            editor.isActive('table') ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
          }`}
          title="Table"
        >
          <Table size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded-md transition-colors ${
            editor.isActive('codeBlock') ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
          }`}
          title="Code Block"
        >
          <Code size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded-md transition-colors ${
            editor.isActive('blockquote') ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
          }`}
          title="Quote"
        >
          <Quote size={16} />
        </button>
      </div>

      <div className="h-6 w-px bg-gray-300 mx-1"></div>

      <div className="flex items-center space-x-1">
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="p-2 rounded-md transition-colors text-gray-700 hover:bg-gray-100"
          title="Undo"
        >
          <Undo size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="p-2 rounded-md transition-colors text-gray-700 hover:bg-gray-100"
          title="Redo"
        >
          <Redo size={16} />
        </button>
      </div>
    </div>
  );
};

export default MenuBar;
