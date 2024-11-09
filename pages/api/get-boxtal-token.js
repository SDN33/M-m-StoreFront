import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Construct the authorization header
    const encodedCredentials = Buffer.from(`${process.env.BOXTEL_ACCESS_KEY}:${process.env.BOXTEL_SECRET_KEY}`).toString('base64');

    // Make the API request to Boxtal
    const response = await axios.post(
      'https://api.boxtal.build/iam/account-app/token',
      {},
      {
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Send the access token as the response
    res.status(200).json({
      token: response.data.accessToken,
    });
  } catch (error) {
    console.error('Error fetching Boxtal access token:', error);
    res.status(500).json({ error: 'Failed to fetch access token' });
  }
}
