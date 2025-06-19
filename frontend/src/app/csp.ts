const policy = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'", 
    "'unsafe-eval'", 
    "'unsafe-inline'",
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com'
  ],
  'style-src': [
    "'self'", 
    "'unsafe-inline'",
    'https://fonts.googleapis.com'
  ],
  'img-src': [
    "'self'", 
    'data:', 
    'blob:',
    'https://www.google-analytics.com',
    'https://www.googletagmanager.com'
  ],
  'font-src': [
    "'self'",
    'data:',
    'https://fonts.gstatic.com'
  ],
  'connect-src': [
    "'self'", 
    'http://localhost:*',
    'https://localhost:*',
    'ws://localhost:*',
    'wss://localhost:*',
    'https://*.supabase.co',
    'https://*.supabase.in',
    'https://kxejkljlfpipavbqvxpm.supabase.co',
    'https://www.facebook.com',
    'https://www.google-analytics.com',
    'https://analytics.google.com',
    'https://*.stripe.com',
    'https://backend-yd4nj.ondigitalocean.app'
  ],
  'frame-src': [
    "'self'",
    'https://*.stripe.com',
    'https://*.supabase.co'
  ],
  'frame-ancestors': ["'none'"],
  'form-action': ["'self'"],
};

export function getCSP(): string {
  return Object.entries(policy)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');
}
