/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Required for react-pdf
    config.resolve.alias.canvas = false
    config.resolve.alias.encoding = false
    return config
  },
  // Add this experimental flag for Next.js 15
  experimental: {
    missingSuspenseWithCSRError: false,
  },
}

module.exports = nextConfig

