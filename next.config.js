/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i0.wp.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'portailpro-memegeorgette.com',
        pathname: '/**',
      },
      {
        protocol: "https",
        hostname: "i1.wp.com",
        pathname: "/**", // Permet toutes les images sous ce domaine
      },
      {
        protocol: "https",
        hostname: "secure.gravatar.com",
        pathname: "/avatar/**", // Permet les avatars Gravatar
      }
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://portailpro-memegeorgette.com/wp-json/wc/v3/:path*',
      },
      {
        source: '/store-api/:path*',
        destination: 'https://portailpro-memegeorgette.com/wp-json/wc/store/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
