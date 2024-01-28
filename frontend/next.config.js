/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  webpack: config => {
    config.resolve.fallback = { fs: false, net: false, tls: false };

    return config;
  },

  // distDir: 'dist',
  // output: 'export',
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hunnyscloset.s3.us-east-2.amazonaws.com',
      },
    ],
  },
};

module.exports = nextConfig;