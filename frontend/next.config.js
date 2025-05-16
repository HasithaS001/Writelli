const webpack = require('webpack');

/** @type {import('next').NextConfig} */
const nextConfig = {
  headers: async () => [
    {
      source: '/_next/static/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `buffer` module
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        buffer: require.resolve('buffer/'),
        fs: false,
        path: require.resolve('path-browserify'),
        stream: require.resolve('stream-browserify'),
        process: require.resolve('process/browser'),
      };
      
      // Add polyfills
      config.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser',
        })
      );
    }
    return config;
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://m.stripe.network https://*.stripe.com;
              style-src 'self' 'unsafe-inline' https://m.stripe.network https://*.stripe.com https://fonts.googleapis.com;
              img-src 'self' data: https://*.stripe.com https://*.facebook.com;
              font-src 'self' data: https://fonts.gstatic.com;
              connect-src 'self' https://*.stripe.com https://*.supabase.co https://*.supabase.in https://www.facebook.com http://localhost:5000;
              frame-src 'self' https://*.stripe.com https://*.facebook.com;
              form-action 'self';
              base-uri 'self';
              object-src 'none';
            `.replace(/\s+/g, ' ').trim()
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
