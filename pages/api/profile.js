import axios from 'axios';

const getUserProfile = async (token) => {
    try {
        const response = await axios.get(
            `${process.env.WC_API_DOMAIN}/wp-json/les-vins-auth/v1/profile`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
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
        const userData = await getUserProfile(token);
        return res.status(200).json(userData);
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
}
