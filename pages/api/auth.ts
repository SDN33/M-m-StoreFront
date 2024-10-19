import axios, { AxiosResponse } from 'axios';

// Configurez l'URL de votre API WooCommerce
const API_URL = 'https://portailpro-memegeorgette.com/wp-json/wc/v3'; // Remplacez par votre URL

// Créez une instance axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Définir les types pour les données d'utilisateur et de connexion
interface User {
  username: string;
  email?: string;
  password: string;
}

interface UserResponse {
  id: number;
  username: string;
  email: string;
  // Ajoutez d'autres propriétés selon vos besoins
}

// Fonction pour se connecter avec JWT
export const login = async (username: string, password: string): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await api.post('/jwt-auth/v1/token', {
      username,
      password,
    });
    return response.data; // Retourne le token et les données de l'utilisateur
  } catch (error) {
    const errorMessage = (error as any).response?.data?.message || 'Erreur de connexion';
    throw new Error(errorMessage);
  }
};

// Fonction pour s'inscrire
export const register = async (data: User): Promise<UserResponse> => {
  try {
    const response: AxiosResponse<UserResponse> = await api.post('/wp/v2/users', data, {
      auth: {
        username: process.env.WC_CONSUMER_KEY || '',
        password: process.env.WC_CONSUMER_SECRET || '',
      },
    });
    return response.data; // Retourne les données de l'utilisateur
  } catch (error) {
    const errorMessage = (error as any).response?.data?.message || 'Erreur d\'inscription';
    throw new Error(errorMessage);
  }
};

// Fonction pour récupérer les informations de l'utilisateur
export const getUserInfo = async (token: string): Promise<UserResponse> => {
  try {
    const response: AxiosResponse<UserResponse> = await api.get('/wp/v2/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Retourne les informations de l'utilisateur
  } catch (error) {
    const errorMessage = (error as any).response?.data?.message || 'Erreur lors de la récupération des informations';
    throw new Error(errorMessage);
  }
};
