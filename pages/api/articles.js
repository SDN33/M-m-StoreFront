import axios from "axios";

export default async function handler(req, res) {
  const WP_API_URL = process.env.WC_API_DOMAIN;
  const POSTS_ENDPOINT = "/wp-json/wp/v2/posts";

  try {
    // Récupération des articles
    const response = await axios.get(`${WP_API_URL}${POSTS_ENDPOINT}`, {
      params: {
        per_page: 10,
        _embed: true,
      },
    });

    const formattedData = await Promise.all(
      response.data.map(async (post) => {
        let featuredImage = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null;

        // Si l'image vedette est absente, on tente d'extraire depuis le contenu
        if (!featuredImage) {
          const match = post.content.rendered.match(/data-orig-file="([^"]+)"/);
          if (match) {
            // Récupération de la première URL (avant l'espace)
            featuredImage = match[1].split(" ")[0];
          }
        }

        return {
          id: post.id,
          title: post.title.rendered,
          content: post.content.rendered,
          excerpt: post.excerpt.rendered,
          date: post.date,
          slug: post.slug,
          author: post._embedded?.author?.[0]?.name || "Anonyme",
          featuredImage,
          timeToRead: Math.max(1, Math.round(
            post.content.rendered.replace(/<[^>]*>/g, '').split(/\s+/).length / 225
          )),
        };
      })
    );

    res.status(200).json({ success: true, articles: formattedData });
  } catch (error) {
    console.error("Erreur lors de la récupération des articles :", error.message);
    res.status(500).json({ success: false, message: "Erreur serveur." });
  }
}
