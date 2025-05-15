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
          
          {/* Modern social proof section */}
          <div className="mt-20">
            {/* Subtle separator */}
            <div className="w-full max-w-xs mx-auto h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-10"></div>
            
            {/* Social proof headline */}
            <p className="text-sm text-gray-500 font-medium mb-8 flex items-center justify-center">
              <span className="h-px w-5 bg-gray-300 mr-3"></span>
              TRUSTED BY INNOVATIVE TEAMS WORLDWIDE
              <span className="h-px w-5 bg-gray-300 ml-3"></span>
            </p>
            
            {/* User metrics in modern cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 text-center hover:border-blue-100 hover:bg-blue-50/30 transition-colors">
                <div className="text-[#0072df] font-bold text-3xl mb-1">5,000+</div>
                <p className="text-gray-600 text-sm">Active Writers</p>
              </div>
              
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 text-center hover:border-blue-100 hover:bg-blue-50/30 transition-colors">
                <div className="flex items-center justify-center mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 text-sm">4.9/5 Rating (2,000+ reviews)</p>
              </div>
              
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 text-center hover:border-blue-100 hover:bg-blue-50/30 transition-colors">
                <div className="text-[#0072df] font-bold text-3xl mb-1">10M+</div>
                <p className="text-gray-600 text-sm">Documents Improved</p>
              </div>
            </div>
            
            {/* Company logos in a modern layout */}
            <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-6">
              {['COMPANY 1', 'COMPANY 2', 'COMPANY 3', 'COMPANY 4', 'COMPANY 5'].map((company, index) => (
                <div key={index} className="text-gray-400 font-semibold text-sm tracking-wider hover:text-[#0072df] transition-colors cursor-pointer">
                  {company}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
