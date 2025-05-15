"use client";

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
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

  // Since we're not using selectedTool or handleToolSelect in this component,
  // we can either remove them or prefix with underscore to indicate they're unused
  const [_selectedTool, _setSelectedTool] = useState<ToolType>(getToolTypeFromPath());

  // Update URL when tool changes (but not using this function, consider removing)
  const _handleToolSelect = (tool: ToolType) => {
    _setSelectedTool(tool);
    router.push(`/${tool}`);
  };

  // Fix dependency array
  useEffect(() => {
    _setSelectedTool(getToolTypeFromPath());
  }, [pathname, getToolTypeFromPath]);

  return (
    <Layout>
      {children}
    </Layout>
  );
}
