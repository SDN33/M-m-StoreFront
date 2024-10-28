import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { username, password } = req.body;

    try {
        // Send request to WordPress API for token
        const response = await axios.post(
            `${process.env.WC_API_DOMAIN}/wp-json/les-vins-auth/v1/token`,
            { username, password }
        );

        const { token } = response.data;

        // Return token to the client
        res.status(200).json({ token });
    } catch (error) {
        const message = error.response?.data?.message || "Login failed.";
        res.status(401).json({ message });
    }
}
