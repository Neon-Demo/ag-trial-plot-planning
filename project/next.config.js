/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['lh3.googleusercontent.com', 'graph.microsoft.com'],
  },
  // Enable standalone output for Docker deployments
  output: 'standalone',
  // Special handling for demo mode - provide mocks for database-related packages
  webpack: (config, { isServer, dev }) => {
    // If we're running in demo mode, replace database packages with mocks
    if (process.env.ALLOW_DEMO_LOGIN === 'true' && !process.env.DATABASE_URL) {
      console.log('🔄 Running in demo-only mode - using module mocks');
      
      // Use path to resolve from the project root
      const path = require('path');
      
      // Add module aliases to use our mock implementations
      config.resolve.alias = {
        ...config.resolve.alias,
        '@auth/prisma-adapter': path.resolve('./src/lib/mock-modules/auth-prisma-adapter.js'),
      };
    }
    
    return config;
  },
};

module.exports = nextConfig;