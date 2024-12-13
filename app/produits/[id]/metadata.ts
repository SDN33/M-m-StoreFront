import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    // Fetch product data with proper URL
    const response = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'}/api/products?id=${params.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 3600 // Revalidate every hour
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch product data: ${response.statusText}`);
    }

    const products = await response.json();
    // Find the specific product that matches the ID from params
    const product = Array.isArray(products)
      ? products.find(p => p.id === parseInt(params.id, 10))
      : null;

    if (!product) {
      return {
        title: "Produit non trouvé | Vins Mémé Georgette",
        description: "Le produit que vous recherchez n'a pas été trouvé.",
      };
    }

    const title = `${product.name} - ${product.millesime || ''} | VinsMemeGeorgette.com`;
    const description = product.description?.replace(/<[^>]*>/g, '') ||
      `Découvrez ${product.name}, un ${product.certification || 'vin'} ${product.region__pays ? `de ${product.region__pays}` : ''} disponible chez Mémé Georgette.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [
          {
            url: product.images?.[0]?.src || '/images/vinmeme.png',
            width: 800,
            height: 600,
            alt: product.name
          }
        ],
        locale: "fr_FR",
        type: "website",
        siteName: "Vins Mémé Georgette",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [product.images?.[0]?.src || '/images/vinmeme.png'],
      },
      alternates: {
        canonical: `https://vinsmemegeorgette.com/produits/${params.id}`
      },
      keywords: [
        product.name,
        product.certification,
        "vin bio",
        "vin biodynamique",
        product.region__pays,
        product.appellation,
        "achat vin en ligne",
        "vins naturels",
        product.cepages,
      ].filter(Boolean),
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
        "product:price:amount": product.price?.toString() || "0",
        "product:price:currency": "EUR",
        "product:availability": product.stock_status === "instock" ? "in stock" : "out of stock",
        "product:condition": "new",
        "product:brand": "Vins Mémé Georgette",
        "product:category": product.categories?.[0]?.name || "Vin",
      }
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    // Return fallback metadata if there's an error
    return {
      title: "Vins Bio et Biodynamiques | Vins Mémé Georgette",
      description: "Découvrez notre sélection de vins biologiques et biodynamiques chez Mémé Georgette.",
    };
  }
}
