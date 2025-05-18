// Environment variables for the frontend
// Remove /api suffix from URL if present
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
export const API_URL = apiUrl.endsWith('/api') ? apiUrl.slice(0, -4) : apiUrl;
