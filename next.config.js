/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)", // Applique à toutes les routes
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable", // Cache pendant 1 an, ne change jamais
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
        ],
      },
    ];
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
      {
        protocol: "https",
        hostname: "i1.wp.com",
        pathname: "/**", // Permet toutes les images sous ce domaine
      },
      {
        protocol: "https",
        hostname: "secure.gravatar.com",
        pathname: "/avatar/**", // Permet les avatars Gravatar
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**", // Permet toutes les images sous ce domaine
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
