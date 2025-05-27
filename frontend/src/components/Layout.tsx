"use client";

import React, { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TOOLS } from '@/types';
import { theme } from '@/app/theme';
import { Icons } from './ui/Icons';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface LayoutProps {
  children: ReactNode;
}

interface SubscriptionData {
  status?: string;
  plan?: string;
  current_period_end?: string;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);
  const [sidebarOpen, setSidebarOpen] = useState(typeof window !== 'undefined' ? window.innerWidth > 768 : true);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const currentTool = pathname.split('/')[1] || 'grammar-checker';
  const { user } = useAuth();
  
  // Fetch user subscription data
  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('profile_id', user.id)
          .single();
          
        if (error && error.code !== 'PGRST116') {
          console.error('Error loading subscription:', error);
        }
        
        if (data) {
          setSubscription(data);
        }
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSubscription();
  }, [user]);
  
  // Check if user has pro plan
  const isPro = subscription?.plan === 'Pro' && subscription?.status === 'active';
  
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
      case 'article-rewriter':
        return <Icons.ArticleRewriter isActive={isActive} />;
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
      case 'article-rewriter':
        return 'A';
      default:
        return 'G';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Modern Sidebar - Desktop */}
      {!isMobile && (
        <aside 
          className={`bg-white shadow-xl transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} 
          fixed inset-y-0 left-0 z-10 flex flex-col`}
        >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          {sidebarOpen ? (
            <h1 className="text-xl font-bold text-[#0072df]">Writelli</h1>
          ) : (
            <h1 className="text-xl font-bold text-[#0072df]">W</h1>
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
                &copy; {new Date().getFullYear()} Writelli
              </div>
            ) : (
              <div className="text-sm text-black text-center w-full">
                &copy;
              </div>
            )}
          </div>
        </div>
      </aside>
      )}

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${!isMobile ? (sidebarOpen ? 'ml-64' : 'ml-20') : 'ml-0'}`}>
        {/* Mobile Tools Bar */}
        {isMobile && (
          <div className="sticky top-16 z-10 bg-white shadow-md overflow-x-auto">
            <div className="flex space-x-2 p-4 min-w-max">
              {TOOLS.map((tool) => (
                <Link 
                  key={tool.id} 
                  href={`/${tool.id}`}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap
                    ${currentTool === tool.id 
                      ? 'bg-[#e6f2ff] text-[#0072df]' 
                      : 'text-black hover:bg-gray-100'}
                  `}
                >
                  <div className="flex items-center space-x-2">
                    <div className="text-gray-600">
                      {getIconForTool(tool.id, currentTool === tool.id)}
                    </div>
                    <span>{tool.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-[#0072df]">
                {TOOLS.find(tool => tool.id === currentTool)?.name || 'Writelli'}
              </h1>
              <Link 
                href={user ? (isPro ? '/profile' : '/pricing') : '/pricing'}
                className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${
                  user && isPro 
                    ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' 
                    : 'bg-[#0072df] text-white hover:bg-[#0058ab] shadow-sm'
                }`}
              >
                {user ? (
                  isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading
                    </span>
                  ) : isPro ? (
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                      Upgrade
                    </span>
                  )
                ) : (
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    Upgrade to Pro
                  </span>
                )}
              </Link>
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
