/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['upload.wikimedia.org'], // Ajouter le domaine pour les images
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://vinsmemegeorgette.wpcomstaging.com/wp-json/wc/v3/:path*', // Redirection des requêtes vers l'API WooCommerce
      },
    ];
  },
};

module.exports = nextConfig;
