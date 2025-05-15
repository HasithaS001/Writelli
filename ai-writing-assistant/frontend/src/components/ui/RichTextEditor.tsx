import React from 'react';
import { AdvancedRichTextEditor } from './AdvancedEditor';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = (props) => {
  return <AdvancedRichTextEditor {...props} />;
};

export default RichTextEditor;
