'use client';

import { useEffect } from 'react';
import Script from 'next/script';

// Declare gtag as a function
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export default function GoogleAnalytics() {
  useEffect(() => {
    // Initialize dataLayer if it doesn't exist
    window.dataLayer = window.dataLayer || [];
    
    // Define gtag function
    function gtag(...args: any[]) {
      window.dataLayer.push(arguments);
    }
    
    // Assign gtag to window
    window.gtag = gtag;
    
    // Initialize GA
    gtag('js', new Date());
    gtag('config', 'G-LN4M0YTJFC', {
      page_path: window.location.pathname,
      transport_type: 'beacon',
      send_page_view: true
    });
    
    // Track page changes
    const handleRouteChange = (url: string) => {
      gtag('config', 'G-LN4M0YTJFC', {
        page_path: url,
        send_page_view: true
      });
    };
    
    // Add event listener for route changes
    window.addEventListener('popstate', () => {
      handleRouteChange(window.location.pathname);
    });
    
    return () => {
      window.removeEventListener('popstate', () => {
        handleRouteChange(window.location.pathname);
      });
    };
  }, []);

  return (
    <>
      {/* Google tag (gtag.js) */}
      <Script 
        src="https://www.googletagmanager.com/gtag/js?id=G-LN4M0YTJFC" 
        strategy="afterInteractive"
        onLoad={() => {
          console.log('Google Analytics script loaded successfully');
        }}
        onError={(e) => {
          console.error('Google Analytics script failed to load', e);
        }}
      />
    </>
  );
}
