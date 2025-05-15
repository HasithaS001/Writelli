"use client";

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import ToolSelector from '@/components/ToolSelector';
import { ToolType, TOOLS } from '@/types';

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  
  // Extract tool type from pathname
  const getToolTypeFromPath = (): ToolType => {
    if (!pathname) return 'grammar-checker';
    const path = pathname.split('/')[1];
    return TOOLS.some(tool => tool.id === path as ToolType) 
      ? path as ToolType 
      : 'grammar-checker';
  };

  const [selectedTool, setSelectedTool] = useState<ToolType>(getToolTypeFromPath());

  // Update URL when tool changes
  const handleToolSelect = (tool: ToolType) => {
    setSelectedTool(tool);
    router.push(`/${tool}`);
  };

  // Update selected tool when URL changes
  useEffect(() => {
    setSelectedTool(getToolTypeFromPath());
  }, [pathname]);

  return (
    <Layout>
      {children}
    </Layout>
  );
}
