"use client";

import TextProcessor from '@/components/TextProcessor';
import ToolPageWrapper from '@/components/ToolPageWrapper';

export default function ReadabilityCheckerPage() {
  return (
    <ToolPageWrapper toolType="readability-checker">
      <TextProcessor toolType="readability-checker" />
    </ToolPageWrapper>
  );
}
