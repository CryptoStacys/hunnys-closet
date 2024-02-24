const nextConfig = {
  reactStrictMode: false,
  webpack: (config, { isServer }) => {
    // Add a rule to handle .wav files
    config.module.rules.push({
      test: /\.wav$/,
      use: {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          publicPath: '/_next/static/sounds/',
          outputPath: 'static/sounds/',
        },
      },
    });

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
      {
        protocol: 'https',
        hostname: 'closet.hunnys.io',
      }
    ],
  },
};

module.exports = nextConfig;
