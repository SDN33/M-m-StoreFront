/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['upload.wikimedia.org', 'i0.wp.com'], // Ajouter "i0.wp.com" pour permettre le chargement des images
    domains: ['portailpro-memegeorgette.com'], // Ajouter le domaine de l'API WooCommerce
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://portailpro-memegeorgette.com/wp-json/wc/v3/:path*', // Redirection des requêtes vers l'API WooCommerce
      },
    ];
  },
};

module.exports = nextConfig;
