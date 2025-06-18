"use client";

import React from 'react';
import { ArticleRewriterMode } from '@/types';

interface ArticleRewriterOptionsProps {
  selectedMode: ArticleRewriterMode;
  onModeChange: (mode: ArticleRewriterMode) => void;
  keyword: string;
  onKeywordChange: (keyword: string) => void;
}

const toneOptions = [
  { id: 'academic', label: 'Academic', description: 'Scholarly and research-oriented style' },
  { id: 'business', label: 'Business', description: 'Professional and corporate tone' },
  { id: 'technical', label: 'Technical', description: 'Precise and detailed technical writing' },
  { id: 'formal', label: 'Formal', description: 'Highly formal and sophisticated language' }
];

const ArticleRewriterOptions: React.FC<ArticleRewriterOptionsProps> = ({
  selectedMode,
  onModeChange,
  keyword,
  onKeywordChange
}: ArticleRewriterOptionsProps) => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="text-sm font-medium text-gray-700 mb-2">Rewrite goal:</div>
      
      <div className="flex flex-col space-y-3">
        <div className="flex items-center space-x-2">
          <input 
            type="radio" 
            id="readability" 
            name="rewriteGoal"
            checked={selectedMode === 'readability'} 
            onChange={() => onModeChange('readability')}
            className="h-4 w-4 text-blue-600"
          />
          <label htmlFor="readability" className="text-sm font-medium text-gray-700 cursor-pointer">
            Improve readability
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          <input 
            type="radio" 
            id="tone" 
            name="rewriteGoal"
            checked={selectedMode === 'tone'} 
            onChange={() => onModeChange('tone')}
            className="h-4 w-4 text-blue-600"
          />
          <label htmlFor="tone" className="text-sm font-medium text-gray-700 cursor-pointer">
            Change tone
          </label>
          {selectedMode === 'tone' && (
            <div className="ml-6 mt-2 space-y-2">
              {toneOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`tone-${option.id}`}
                    name="toneType"
                    checked={keyword === option.id}
                    onChange={() => onKeywordChange(option.id)}
                    className="h-4 w-4 text-blue-600"
                  />
                  <label htmlFor={`tone-${option.id}`} className="text-sm text-gray-600 cursor-pointer">
                    <span className="font-medium">{option.label}</span>
                    <span className="text-gray-500 ml-1">- {option.description}</span>
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <input 
              type="radio" 
              id="seo" 
              name="rewriteGoal"
              checked={selectedMode === 'seo'} 
              onChange={() => onModeChange('seo')}
              className="h-4 w-4 text-blue-600"
            />
            <label htmlFor="seo" className="text-sm font-medium text-gray-700 cursor-pointer">
              Optimize for SEO
            </label>
          </div>
          
          {selectedMode === 'seo' && (
            <div className="ml-6">
              <label htmlFor="keyword" className="text-xs text-gray-600 mb-1 block">
                Enter target keyword:
              </label>
              <input
                type="text"
                id="keyword"
                value={keyword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onKeywordChange(e.target.value)}
                className="h-8 text-sm border border-gray-300 rounded px-2 w-full"
                placeholder="e.g. digital marketing"
              />
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <input 
            type="radio" 
            id="unique" 
            name="rewriteGoal"
            checked={selectedMode === 'unique'} 
            onChange={() => onModeChange('unique')}
            className="h-4 w-4 text-blue-600"
          />
          <label htmlFor="unique" className="text-sm font-medium text-gray-700 cursor-pointer">
            Make it unique
          </label>
        </div>
      </div>
    </div>
  );
};

export default ArticleRewriterOptions;
