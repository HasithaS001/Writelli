"use client";

import TextProcessor from '@/components/TextProcessor';
import ToolPageWrapper from '@/components/ToolPageWrapper';

export default function ToneConverterPage() {
  return (
    <ToolPageWrapper toolType="tone-converter">
      <TextProcessor toolType="tone-converter" />
    </ToolPageWrapper>
  );
}
