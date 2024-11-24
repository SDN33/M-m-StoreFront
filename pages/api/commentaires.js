import axios from "axios";

export default async function handler(req, res) {
  const WP_API_URL = process.env.WC_API_DOMAIN; // Domaine de votre API WordPress
  const COMMENTS_ENDPOINT = "/wp-json/wp/v2/comments"; // Endpoint WordPress pour les commentaires

  try {
    // Récupérer les paramètres de la requête
    const { postId, per_page = 10, page = 1 } = req.query;

    // Préparer les paramètres pour la requête
    const params = {
      per_page, // Nombre de commentaires par page
      page, // Page actuelle
    };

    // Ajouter un filtre par `postId` si fourni
    if (postId) {
      params.post = postId;
    }

    // Effectuer une requête à l'API pour récupérer les commentaires
    const response = await axios.get(`${WP_API_URL}${COMMENTS_ENDPOINT}`, {
      params,
    });

    // Formater les données pour simplifier leur consommation côté frontend
    const formattedComments = response.data.map((comment) => ({
      id: comment.id,
      postId: comment.post,
      author: comment.author_name,
      content: comment.content.rendered,
      date: comment.date,
      authorAvatar: comment.author_avatar_urls?.["48"] || null, // Avatar de l'auteur
    }));

    // Retourner les commentaires formatés
    res.status(200).json({ success: true, comments: formattedComments });
  } catch (error) {
    // Gestion des erreurs
    console.error("Erreur lors de la récupération des commentaires :", error.message);
    res.status(500).json({ success: false, message: "Erreur serveur." });
  }
}
