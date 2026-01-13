/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Exclude better-sqlite3 from client bundle only
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'better-sqlite3': false,
      };
    }
    // Don't externalize better-sqlite3 - it needs to be bundled for Vercel
    return config;
  },
  // Ensure better-sqlite3 is included in server bundle
  experimental: {
    serverComponentsExternalPackages: [],
  },
}

module.exports = nextConfig
