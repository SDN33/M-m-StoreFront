'use client';

import { useEffect, useState } from 'react';
import { getUserInfo } from '../../pages/api/auth';

interface User {
  id: number; // Assurez-vous que cela correspond aux données renvoyées par votre API
  username: string; // Changer "name" en "username" si c'est le bon champ
  email: string;
  // Ajoutez d'autres propriétés utilisateur ici si nécessaire
}

const DashboardPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login'; // Redirige vers la page de connexion si pas connecté
      } else {
        try {
          const userInfo = await getUserInfo(token);
          setUser(userInfo); // Stocke les informations de l'utilisateur
        } catch (error) {
          setError((error as Error).message);
        }
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Mon Dashboard</h1>
      {error && <p className="error">{error}</p>}
      {user ? (
        <div>
          <h2>Bienvenue, {user.username}</h2> {/* Modifié pour utiliser username */}
          <p>Email: {user.email}</p>
          {/* Ajoutez d'autres informations utilisateur ici */}
        </div>
      ) : (
        <p>Chargement...</p>
      )}
    </div>
  );
};

export default DashboardPage;
