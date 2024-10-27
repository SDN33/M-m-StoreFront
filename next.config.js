/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    WC_API_DOMAIN: process.env.WC_API_DOMAIN,
  },
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
