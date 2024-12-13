
export const metadata= {
  title: "Le Blog de Mémé Georgette | VinsMemeGeorgette.com",
  description: "Découvrez nos articles sur le vin bio, la biodynamie, et l'actualité du monde viticole. Conseils, dégustations et informations sur les vins naturels.",
  openGraph: {
    title: "Le Blog de Mémé Georgette | VinsMemeGeorgette.com",
    description: "Découvrez nos articles sur le vin bio, la biodynamie, et l'actualité du monde viticole. Conseils, dégustations et informations sur les vins naturels.",
    images: [
      {
        url: "/images/blog-banner.webp",
        width: 1200,
        height: 630,
        alt: "Blog Mémé Georgette - Vins Bio et Biodynamiques"
      }
    ],
    locale: "fr_FR",
    type: "website",
    siteName: "VinsMemeGeorgette.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Le Blog de Mémé Georgette | VinsMemeGeorgette.com",
    description: "Découvrez nos articles sur le vin bio, la biodynamie, et l'actualité du monde viticole.",
    images: ["/images/blog-banner.webp"],
    creator: "@MemeGeorgette",
  },
  alternates: {
    canonical: "https://vinsmemegeorgette.com/blog"
  },
  keywords: [
    "blog vin bio",
    "articles vin biodynamique",
    "actualités vin naturel",
    "blog dégustation vin",
    "conseils vin bio",
    "blog Mémé Georgette",
    "articles viticulture biologique",
    "blog vin nature"
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    "og:type": "blog",
    "article:publisher": "VinsMemeGeorgette.com",
    "article:section": "Blog"
  }
};
