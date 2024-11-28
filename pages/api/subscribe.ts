import { NextApiRequest, NextApiResponse } from 'next';

const sendToBrevo = async (email: string) => {
  const apiKey = process.env.BREVO_API_KEY; // Votre clé API Brevo
  const listId = 3; // Remplacez par l'ID numérique de votre liste sur Brevo, pas le nom de la liste

  if (!apiKey) {
    throw new Error('API key is missing');
  }

  const response = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify({
      email: email,
      listIds: [listId], // Assurez-vous que l'ID de la liste est correct
    }),
  });

  const data = await response.json(); // Récupère la réponse JSON de l'API

  if (!response.ok) {
    console.error('Erreur Brevo:', data); // Affichez l'erreur complète
    throw new Error(data.message || 'Erreur lors de l\'ajout à la liste Brevo');
  }

  return data; // Retourne les données de réponse de l'API Brevo
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email } = req.body;

    // Vérification de l'email
    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: 'Email invalide.' });
    }

    try {
      const result = await sendToBrevo(email);
      return res.status(200).json({ message: 'Email ajouté à la newsletter.', result });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      return res.status(500).json({ message: errorMessage });
    }
  } else {
    return res.status(405).json({ message: 'Méthode non autorisée.' });
  }
}
