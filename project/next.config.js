/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['lh3.googleusercontent.com', 'graph.microsoft.com', 'ui-avatars.com'],
  },
  // Disable font optimization to avoid external requests
  optimizeFonts: false,
};

module.exports = nextConfig;