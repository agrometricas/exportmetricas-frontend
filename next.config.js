module.exports = {
  images: {
    // The images are signed R2 URLs, a new one on every request: the optimizer
    // could not cache them, and they need no resizing.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.r2.cloudflarestorage.com',
      },
    ],
  },
};
