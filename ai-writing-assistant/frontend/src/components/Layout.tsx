"use client";

import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TOOLS } from '@/types';
import { theme } from '@/app/theme';
import { Icons } from './ui/Icons';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const currentTool = pathname.split('/')[1] || 'grammar-checker';
  
  // Function to get the appropriate icon for each tool
  const getIconForTool = (toolId: string, isActive: boolean = false) => {
    switch(toolId) {
      case 'grammar-checker':
        return <Icons.GrammarChecker isActive={isActive} />;
      case 'readability-checker':
        return <Icons.ReadabilityChecker isActive={isActive} />;
      case 'paraphraser':
        return <Icons.Paraphraser isActive={isActive} />;
      case 'summarizer':
        return <Icons.Summarizer isActive={isActive} />;
      case 'translator':
        return <Icons.Translator isActive={isActive} />;
      case 'tone-converter':
        return <Icons.ToneConverter isActive={isActive} />;
      case 'humanizer':
        return <Icons.Humanizer isActive={isActive} />;
      default:
        return <Icons.GrammarChecker isActive={isActive} />;
    }
  };
  
  // Function to get the letter for each tool when sidebar is collapsed
  const getLetterForTool = (toolId: string) => {
    switch(toolId) {
      case 'grammar-checker':
        return 'G';
      case 'readability-checker':
        return 'R';
      case 'paraphraser':
        return 'P';
      case 'summarizer':
        return 'S';
      case 'translator':
        return 'T';
      case 'tone-converter':
        return 'C';
      case 'humanizer':
        return 'H';
      default:
        return 'G';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Modern Sidebar */}
      <aside 
        className={`bg-white shadow-xl transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} 
        fixed inset-y-0 left-0 z-10 flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          {sidebarOpen ? (
            <h1 className="text-xl font-bold text-[#0072df]">AI Writing</h1>
          ) : (
            <h1 className="text-xl font-bold text-[#0072df]">AI</h1>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            {sidebarOpen ? (
              <Icons.Close />
            ) : (
              <Icons.Menu />
            )}
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <div className="space-y-1">
            {TOOLS.map((tool) => (
              <Link 
                key={tool.id} 
                href={`/${tool.id}`}
                className={`flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors
                  ${currentTool === tool.id 
                    ? 'bg-[#e6f2ff] text-[#0072df]' 
                    : 'text-black hover:bg-gray-100'}
                `}
              >
                <span className="truncate">
                  {sidebarOpen ? (
                    <div className="flex items-center">
                      <div className="mr-3 text-gray-600">
                        {getIconForTool(tool.id, currentTool === tool.id)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">{tool.name}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-center items-center w-full">
                      {getIconForTool(tool.id, currentTool === tool.id)}
                    </div>
                  )}
                </span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            {sidebarOpen ? (
              <div className="text-sm text-black">
                &copy; {new Date().getFullYear()} AI Writing Assistant
              </div>
            ) : (
              <div className="text-sm text-black text-center w-full">
                &copy;
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-[#0072df]">
                {TOOLS.find(tool => tool.id === currentTool)?.name || 'AI Writing Assistant'}
              </h1>
            </div>
          </div>
        </header>
        
        <main className="px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
