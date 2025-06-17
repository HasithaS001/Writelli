'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    // Send pageview event to Google Analytics
    window.gtag?.('event', 'page_view', {
      page_path: pathname,
      page_title: getPageTitle(pathname),
      page_location: window.location.href
    });
  }, [pathname]);

  return null; // This component doesn't render anything
}

function getPageTitle(path: string): string {
  // Remove leading slash and convert to title case
  const basePath = path.slice(1);
  if (!basePath) return 'Home';
  
  // Handle nested routes
  const lastSegment = basePath.split('/').pop() || '';
  
  // Convert kebab-case to Title Case
  return lastSegment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ') || 'Home';
}
