"use client";

import React from 'react';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Modern abstract background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-[#0072df]/5 to-blue-300/5 blur-3xl"></div>
        <div className="absolute top-[60%] -left-[5%] w-[30%] h-[30%] rounded-full bg-gradient-to-tr from-[#0072df]/5 to-blue-300/5 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-6 py-24 sm:py-32 relative">
        <div className="max-w-4xl mx-auto">
          {/* Pre-heading badge */}
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-6 text-sm text-[#0072df] font-medium">
            <span className="w-2 h-2 rounded-full bg-[#0072df] mr-2"></span>
            AI-Powered Writing Assistant
          </div>
          
          {/* Main heading with modern typography */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
            Elevate Your <span className="relative inline-block">
              <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-[#0072df] to-blue-500">Writing</span>
              <span className="absolute -bottom-2 left-0 w-full h-3 bg-blue-100/50 -z-10 rounded"></span>
            </span> with Intelligent Precision
          </h1>
          
          {/* Subheading with improved typography */}
          <p className="mt-8 text-xl text-gray-600 leading-relaxed max-w-3xl">
            Transform your content with our advanced AI writing assistant. From grammar checking to style enhancement 
            and content generation — all in one powerful, intuitive dashboard.
          </p>
          
          {/* Modern CTA section with subtle separator */}
          <div className="mt-12 flex flex-col sm:flex-row gap-5">
            <Link 
              href="/grammar-checker" 
              className="px-8 py-4 bg-[#0072df] hover:bg-blue-600 text-white font-medium rounded-lg text-center transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
            >
              Try for Free
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            <Link 
              href="#features" 
              className="px-8 py-4 border border-gray-200 hover:border-[#0072df] text-gray-700 hover:text-[#0072df] font-medium rounded-lg text-center transition-all flex items-center justify-center group"
            >
              Learn More
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L11.586 12H5a1 1 0 110-2h6.586l-2.293-2.293a1 1 0 011.414-1.414l4 4z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
