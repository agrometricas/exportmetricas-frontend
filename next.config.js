module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.r2.cloudflarestorage.com',
      },
    ],
  },
  webpack(config, options) {
    config.devtool = 'eval-source-map';
    return config;
  },
};
