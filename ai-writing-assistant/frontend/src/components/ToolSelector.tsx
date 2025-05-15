"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { TOOLS, ToolType } from '@/types';

interface ToolSelectorProps {
  selectedTool: ToolType;
  onSelectTool: (tool: ToolType) => void;
}

const ToolSelector: React.FC<ToolSelectorProps> = ({ selectedTool, onSelectTool }) => {
  const router = useRouter();

  const handleToolSelect = (tool: ToolType) => {
    onSelectTool(tool);
    router.push(`/${tool}`);
  };

  return (
    <div className="flex flex-col space-y-2 bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Tools</h2>
      <div className="flex flex-col space-y-1">
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            onClick={() => handleToolSelect(tool.id)}
            className={`px-4 py-2 rounded-md text-left transition-colors ${
              selectedTool === tool.id
                ? 'bg-blue-100 text-blue-700 font-medium'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <div className="font-medium">{tool.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ToolSelector;
