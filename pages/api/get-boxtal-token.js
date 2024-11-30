// pages/api/boxtal-proxy.js
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Encodage des credentials
    const encodedCredentials = Buffer.from(
      `${process.env.BOXTEL_ACCESS_KEY}:${process.env.BOXTEL_SECRET_KEY}`
    ).toString('base64');

    // Proxy pour rediriger la requête vers Boxtal
    const response = await axios.post(
      'https://api.boxtal.com/iam/account-app/token',
      req.body, // Les données envoyées par le frontend peuvent être transmises ici
      {
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Erreur proxy Boxtal:', error?.response?.data || error.message);
    res.status(error?.response?.status || 500).json({
      error: error?.response?.data?.error || 'Échec de la récupération du token',
    });
  }
}
