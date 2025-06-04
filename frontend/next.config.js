const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

// Get all SEO HTML files to create rewrites
const seoDir = path.join(__dirname, 'public/seo');
const seoFiles = fs.existsSync(seoDir) ? 
  fs.readdirSync(seoDir)
    .filter(file => file.endsWith('.html'))
    .map(file => file.replace('.html', '')) : [];

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval';
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
              img-src 'self' data: blob:;
              font-src 'self' data: https://fonts.gstatic.com;
              connect-src 'self' http://localhost:* https://*.stripe.com https://*.supabase.co https://*.supabase.in https://www.facebook.com https://backend-yd4nj.ondigitalocean.app;
              frame-src 'self';
            `.replace(/\s+/g, ' ').trim(),
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
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
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NEXT_PUBLIC_APP_VERSION': JSON.stringify(process.env.npm_package_version),
      })
    );
    return config;
  },

  async rewrites() {
    return [
      // Serve each SEO HTML file from its clean URL path
      ...seoFiles.map(file => ({
        source: `/${file}`,
        destination: `/seo/${file}.html`,
      })),
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
