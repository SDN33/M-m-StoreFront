import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { username, email, password } = req.body;

    try {
        // Forward the request to the WordPress API
        await axios.post(
            `${process.env.WC_API_DOMAIN}/wp-json/les-vins-auth/v1/register`,
            { username, email, password }
        );

        // Send a success response
        res.status(200).json({ message: "User registered successfully." });
    } catch (error) {
        const message = error.response?.data?.message || "Failed to register. Please try again.";
        res.status(500).json({ message });
    }
}
