"use client";

import TextProcessor from '@/components/TextProcessor';
import ToolPageWrapper from '@/components/ToolPageWrapper';

export default function SummarizerPage() {
  return (
    <ToolPageWrapper toolType="summarizer">
      <TextProcessor toolType="summarizer" />
    </ToolPageWrapper>
  );
}
