"use client";

import TextProcessor from '@/components/TextProcessor';
import ToolPageWrapper from '@/components/ToolPageWrapper';

export default function TranslatorPage() {
  return (
    <ToolPageWrapper toolType="translator">
      <TextProcessor toolType="translator" />
    </ToolPageWrapper>
  );
}
