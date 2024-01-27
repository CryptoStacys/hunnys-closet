const { GenerateSW } = require('workbox-webpack-plugin');

const nextConfig = {
  reactStrictMode: false,
  webpack: (config, { isServer }) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };

    if (!isServer) {
      config.plugins.push(
        new GenerateSW({
          swDest: 'static/service-worker.js',
          // Define strict caching rules here
          runtimeCaching: [
            {
              // Match requests for images in the Closet
              urlPattern: /^https:\/\/hunnyscloset\.s3\.us-east-2\.amazonaws\.com\/.*/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'closet-images-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 24 * 60 * 60, // 1 day
                },
              },
            },
            // Add other runtime caching rules as needed
          ],
        })
      );
    }

    return config;
  },
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
