// Environment variables for the frontend

// Determine if we're running in a browser environment
const isBrowser = typeof window !== 'undefined';

// Get the current hostname in browser or use default in SSR
const hostname = isBrowser ? window.location.hostname : '';

// Default API URL based on environment
let defaultApiUrl = '/api';

// For local development, use localhost:5000
if (isBrowser && (hostname === 'localhost' || hostname === '127.0.0.1')) {
  defaultApiUrl = 'http://localhost:5000';
}

// Use environment variable if provided, otherwise use the default
const rawUrl = process.env.NEXT_PUBLIC_API_URL || defaultApiUrl;

// Remove trailing slashes and normalize
const normalizeUrl = (url: string) => {
  // Don't modify relative URLs like '/api'
  if (url.startsWith('/')) return url;
  
  let normalized = url.endsWith('/') ? url.slice(0, -1) : url;
  return normalized;
};

export const API_URL = normalizeUrl(rawUrl);

// Log the API URL in development
if (process.env.NODE_ENV !== 'production' && isBrowser) {
  console.log('Using API URL:', API_URL);
}
