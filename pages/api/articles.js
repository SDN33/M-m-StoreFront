import axios from "axios";

export default async function handler(req, res) {
  const WP_API_URL = process.env.WC_API_DOMAIN; // Ajoutez l'URL de votre API WordPress dans le fichier `.env`
  const POSTS_ENDPOINT = "/wp-json/wp/v2/posts"; // Endpoint pour récupérer les articles

  try {
    // Requête vers l'API WordPress
    const response = await axios.get(`${WP_API_URL}${POSTS_ENDPOINT}`, {
      params: {
        per_page: 10, // Nombre d'articles à récupérer
        _embed: true, // Inclut les données supplémentaires (comme les images)
      },
    });

    // Déboguer la réponse de l'API pour voir la structure exacte
    console.log("Réponse de l'API :", JSON.stringify(response.data, null, 2)); // Affiche la réponse complète

    // Formater les données des articles pour le frontend
    const formattedData = response.data.map((post) => {
      const featuredImage = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null;

      console.log("Image vedette pour l'article ID", post.id, ":", featuredImage); // Vérification de l'image

      return {
        id: post.id,
        title: post.title.rendered,
        content: post.content.rendered,
        excerpt: post.excerpt.rendered,
        date: post.date,
        slug: post.slug,
        author: post._embedded?.author?.[0]?.name || "Anonyme",
        featuredImage: featuredImage,
      };
    });

    // Retourner les articles formatés avec l'image vedette
    res.status(200).json({ success: true, articles: formattedData });
  } catch (error) {
    console.error("Erreur lors de la récupération des articles :", error.message);
    res.status(500).json({ success: false, message: "Erreur serveur." });
  }
}
