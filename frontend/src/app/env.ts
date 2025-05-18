// Environment variables for the frontend
// Normalize the API URL
const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Remove trailing slashes and /api suffix
const normalizeUrl = (url: string) => {
  let normalized = url.endsWith('/') ? url.slice(0, -1) : url;
  normalized = normalized.endsWith('/api') ? normalized.slice(0, -4) : normalized;
  return normalized;
};

export const API_URL = normalizeUrl(rawUrl);
