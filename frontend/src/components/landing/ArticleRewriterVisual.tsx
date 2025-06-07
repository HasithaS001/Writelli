"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const ArticleRewriterVisual = () => {
  // Use state to track client-side rendering
  const [isClient, setIsClient] = useState(false);
  
  // Check if we have the screenshot image
  const useScreenshot = false; // Set to true when screenshot is available

  // Only render on client-side to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Return null during SSR to avoid hydration mismatch
  if (!isClient) {
    return <div className="h-[400px] w-full bg-blue-50 rounded-xl"></div>;
  }

  return useScreenshot ? (
    <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-gray-900/10">
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/10 to-gray-900/5 pointer-events-none"></div>
      <Image
        src="/images/article-rewriter-screenshot.png"
        alt="Article Rewriter Interface"
        width={600}
        height={450}
        className="object-cover w-full h-full"
        priority
      />
      {/* Decorative Elements */}
      <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-blue-600/10 rounded-full blur-2xl"></div>
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-purple-600/10 rounded-full blur-2xl"></div>
    </div>
  ) : (
    // Fallback visual representation
    <div className="bg-blue-50 rounded-xl p-6 shadow-lg">
      <div className="relative h-[400px] w-full rounded-lg overflow-hidden border border-blue-200">
        {/* Original document */}
        <div className="absolute top-10 left-10 w-[40%] h-[80%] bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-600">
          <div className="h-6 bg-blue-100 rounded w-3/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-4/5"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
        
        {/* Arrow */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7-7 7"></path>
            </svg>
          </div>
        </div>
        
        {/* Rewritten document */}
        <div className="absolute top-10 right-10 w-[40%] h-[80%] bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-600">
          <div className="h-6 bg-blue-100 rounded w-3/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-blue-100 rounded w-full"></div>
            <div className="h-3 bg-blue-100 rounded w-5/6"></div>
            <div className="h-3 bg-blue-100 rounded w-full"></div>
            <div className="h-3 bg-blue-100 rounded w-4/5"></div>
            <div className="h-3 bg-blue-100 rounded w-full"></div>
            <div className="h-3 bg-blue-100 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleRewriterVisual;
