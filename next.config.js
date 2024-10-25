/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['upload.wikimedia.org', 'i0.wp.com', 'portailpro-memegeorgette.com'], // Conserve les deux domaines d'images
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://portailpro-memegeorgette.com/wp-json/wc/v3/:path*', // Redirection des requêtes vers l'API WooCommerce (v3 API)
      },
      {
        source: '/store-api/:path*',
        destination: 'https://portailpro-memegeorgette.com/wp-json/wc/store/:path*', // Redirection pour les opérations spécifiques au panier via Store API
      },

    ];
  },
};

module.exports = nextConfig;
