import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { email } = req.body;

    try {
        // Forward the request to the WordPress API
        await axios.post(
            `${process.env.WC_API_DOMAIN}/wp-json/les-vins-auth/v1/forgot-password`,
            { email }
        );

        // Send a success message back to the client
        res.status(200).json({ message: "Password reset link sent. Please check your email." });
    } catch (error) {
        const message = error.response?.data?.message || "Failed to send reset link.";
        res.status(500).json({ message });
    }
}
