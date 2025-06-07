"use client";

import React from 'react';
import Select from '@/components/ui/Select';
import { TOOLS, ToolType } from '@/types';
import { SUBSCRIPTION_FEATURES } from '@/types/subscription';

interface ModeSelectorProps {
  toolType: ToolType;
  selectedMode: string;
  onModeChange: (mode: string) => void;
  isProUser?: boolean;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ 
  toolType, 
  selectedMode, 
  onModeChange,
  isProUser = false
}) => {
  const tool = TOOLS.find(t => t.id === toolType);
  
  if (!tool || tool.modes.length === 0) {
    return null;
  }

  // Determine which modes require Pro subscription
  const proOnlyModes = {
    'paraphraser': ['expand', 'academic', 'seo'],
    'summarizer': ['detailed'],
    'humanizer': ['bypass']
  };
  
  // Check if a mode is Pro-only
  const isProOnlyMode = (modeId: string) => {
    return proOnlyModes[toolType as keyof typeof proOnlyModes]?.includes(modeId) || false;
  };

  return (
    <div className="mb-5">
      <Select
        label="Mode"
        options={tool.modes.map(mode => ({
          id: mode.id,
          name: isProOnlyMode(mode.id) ? `${mode.name} ${isProUser ? '' : '(Pro)'}` : mode.name,
          disabled: isProOnlyMode(mode.id) && !isProUser
        }))}
        value={selectedMode}
        onChange={onModeChange}
        placeholder="Select a mode"
        className="text-black"
      />
      {selectedMode && (
        <div className="mt-2 text-sm">
          <p className={`p-2 rounded-md border ${isProOnlyMode(selectedMode) && !isProUser ? 'bg-amber-50 border-amber-200 text-black' : 'bg-[#e6f2ff] border-[#0072df]/10 text-black'}`}>
            {tool.modes.find(m => m.id === selectedMode)?.description}
            {isProOnlyMode(selectedMode) && !isProUser && (
              <span className="block mt-1 font-medium text-black">
                This feature requires a Pro subscription. 
                <a href="/pricing" className="text-blue-600 hover:text-blue-800 underline">Upgrade now</a>
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default ModeSelector;
