"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const ArticleRewriterVisual = () => {
  // Use state to track client-side rendering
  const [isClient, setIsClient] = useState(false);
  
  // Only render on client-side to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Return null during SSR to avoid hydration mismatch
  if (!isClient) {
    return <div className="h-[400px] w-full bg-blue-50 rounded-xl"></div>;
  }

  return (
    <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-gray-900/10">
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/10 to-gray-900/5 pointer-events-none"></div>
      <Image
        src="/images/article-rewriter.png"
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
  );
};

export default ArticleRewriterVisual;
