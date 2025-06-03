"use client";

import TextProcessor from '@/components/TextProcessor';
import ToolPageWrapper from '@/components/ToolPageWrapper';

export default function ParaphraserPage() {
  return (
    <ToolPageWrapper toolType="paraphraser">
      <TextProcessor toolType="paraphraser" />
    </ToolPageWrapper>
  );
}
