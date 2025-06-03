"use client";

import TextProcessor from '@/components/TextProcessor';
import ToolPageWrapper from '@/components/ToolPageWrapper';

export default function GrammarCheckerPage() {
  return (
    <ToolPageWrapper toolType="grammar-checker">
      <TextProcessor toolType="grammar-checker" />
    </ToolPageWrapper>
  );
}
