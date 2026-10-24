module.exports = {
  images: {
    // Next 14 has no fix for the remote code execution advisories in its image
    // optimizer, and these images are signed R2 URLs that need no resizing.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.r2.cloudflarestorage.com',
      },
    ],
  },
};
