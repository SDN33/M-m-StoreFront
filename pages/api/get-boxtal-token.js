import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const encodedCredentials = Buffer.from(
      `${process.env.BOXTEL_ACCESS_KEY}:${process.env.BOXTEL_SECRET_KEY}`
    ).toString('base64');

    const response = await axios.post(
      'https://api.boxtal.com/iam/account-app/token',
      {},
      {
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.status(200).json({
      token: response.data.accessToken,
    });
  } catch (error) {
    console.error('Error fetching Boxtal access token:', error?.response?.data || error.message);
    res.status(error?.response?.status || 500).json({
      error: error?.response?.data?.message || 'Failed to fetch access token',
    });
  }
}
