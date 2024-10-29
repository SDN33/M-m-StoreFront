import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authorization token is missing' });
    }

    try {
        // Forward the request to the WordPress API
        const response = await axios.get(
            `${process.env.WC_API_DOMAIN}/wp-json/les-vins-auth/v1/profile`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        // Send user data back to the client
        res.status(200).json(response.data);
    } catch (error) {
        const message = error.response?.data?.message || "Failed to fetch user data.";
        res.status(401).json({ message });
    }
}
