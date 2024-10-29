import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { token, password } = req.body;

    if (!token || !password) {
        return res.status(400).json({ message: 'Token and password are required' });
    }

    try {
        // Forward the request to the WordPress reset password endpoint
        await axios.post(
            `${process.env.WC_API_DOMAIN}/wp-json/les-vins-auth/v1/reset-password`,
            { token, password }
        );

        // Send a success response
        res.status(200).json({ message: "Password reset successful." });
    } catch (error) {
        const message = error.response?.data?.message || "Password reset failed.";
        res.status(500).json({ message });
    }
}
