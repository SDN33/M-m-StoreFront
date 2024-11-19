import axios from 'axios';

export default async function handler(req, res) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authorization token is missing' });
    }

    // Configuration commune pour axios
    const axiosConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    };

    try {
        switch (req.method) {
            case 'GET':
                // Récupérer les données du profil
                const getResponse = await axios.get(
                    `${process.env.WC_API_DOMAIN}/wp-json/les-vins-auth/v1/profile`,
                    axiosConfig
                );
                return res.status(200).json(getResponse.data);

            case 'PUT':
                // Mettre à jour les données du profil
                const updateResponse = await axios.put(
                    `${process.env.WC_API_DOMAIN}/wp-json/les-vins-auth/v1/profile`,
                    req.body,
                    axiosConfig
                );
                return res.status(200).json(updateResponse.data);

            default:
                return res.status(405).json({ message: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Profile API Error:', error.response?.data || error.message);
        const statusCode = error.response?.status || 500;
        const message = error.response?.data?.message || "An error occurred while processing your request.";
        return res.status(statusCode).json({ message });
    }
}
