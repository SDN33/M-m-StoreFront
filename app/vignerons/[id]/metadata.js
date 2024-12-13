async function getVigneron(id) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/get-vendor`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: parseInt(id) })
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch vigneron with ID ${id}`);
  }
  return response.json();
}

export async function generateMetadata({ params }) {
  const id = params.id;

  try {
    const vigneron = await getVigneron(id);

    // Check if vigneron data is valid
    if (!vigneron || typeof vigneron !== 'object' || !vigneron.display_name) {
      throw new Error('Vigneron not found');
    }

    return {
      title: `${vigneron.display_name} | Vigneron.ne Bio | VinsMemeGeorgette.com`,
      description: `Découvrez ${vigneron.display_name}, vigneron.ne bio partenaire de Mémé Georgette : ${vigneron.description || 'description non renseignée'}`,
      openGraph: {
        title: `${vigneron.display_name} | Vigneron.ne Bio | VinsMemeGeorgette.com`,
        description: `Découvrez ${vigneron.display_name}, vigneron.ne bio partenaire de Mémé Georgette : ${vigneron.description || 'description non renseignée'}`,
        images: [
          {
            url: vigneron.shop?.banner || "/images/blog-banner.webp",
            width: 1200,
            height: 630,
            alt: `${vigneron.display_name} - Vigneron.ne Bio`
          }
        ],
        locale: "fr_FR",
        type: "website",
        siteName: "VinsMemeGeorgette.com",
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: "Vigneron.ne Bio | VinsMemeGeorgette.com",
      description: "Vigneron.ne bio partenaire de Mémé Georgette.",
      openGraph: {
        title: "Vigneron.ne Bio | VinsMemeGeorgette.com",
        description: "Vigneron.ne bio partenaire de Mémé Georgette.",
        images: [
          {
            url: "/images/blog-banner.webp",
            width: 1200,
            height: 630,
            alt: "Vigneron.ne Bio - Vins Bio et Biodynamiques"
          }
        ],
        locale: "fr_FR",
        type: "website",
        siteName: "VinsMemeGeorgette.com",
      },
    };
  }
}
