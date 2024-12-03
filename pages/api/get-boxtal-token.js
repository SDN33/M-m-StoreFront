// pages/api/boxtal-proxy.js
import axios from 'axios';

export default async function handler(req, res) {
  // Ensure that the request is a POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Encode the credentials (Boxtal Access Key and Secret Key) in Base64
    const encodedCredentials = Buffer.from(
      `${process.env.NEXT_PUBLIC_BOXTEL_ACCESS_KEY}:${process.env.BOXTEL_SECRET_KEY}`
    ).toString('base64');

    // Proxy the request to Boxtal API, passing the body data from the frontend
    const response = await axios.post(
      'https://api.boxtal.com/iam/account-app/token', // URL to Boxtal API
      req.body, // Forward the body sent by the frontend (e.g., login data)
      {
        headers: {
          Authorization: `Basic ${encodedCredentials}`, // Authentication header
          'Content-Type': 'application/json', // JSON content type
        },
      }
    );

    // Send the successful response back to the frontend
    res.status(200).json(response.data);
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Erreur proxy Boxtal:', error?.response?.data || error.message);

    // Send the error response to the frontend
    res.status(error?.response?.status || 500).json({
      error: error?.response?.data?.error || 'Erreur lors du chargement de la map Boxtal',
    });
  }
}
