import axios from 'axios';
import { setCookie } from 'cookies-next';

const getUserProfile = async (token, req, res) => {
    try {
        const response = await axios.get(
            `${process.env.WC_API_DOMAIN}/wp-json/les-vins-auth/v1/profile`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        // Sauvegarde de l'e-mail dans un cookie
        setCookie('user_email', response.data.email, {
            req,
            res,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7 // 7 jours
        });

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch user data.");
    }
};

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Authorization token is missing' });
    }

    try {
        // Passage de req et res à getUserProfile
        const userData = await getUserProfile(token, req, res);
        return res.status(200).json(userData);
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
}
