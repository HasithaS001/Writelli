"use client";

import TextProcessor from '@/components/TextProcessor';
import ToolPageWrapper from '@/components/ToolPageWrapper';

export default function HumanizerPage() {
  return (
    <ToolPageWrapper toolType="humanizer">
      <TextProcessor toolType="humanizer" />
    </ToolPageWrapper>
  );
}
