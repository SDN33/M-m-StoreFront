"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, CheckCircle } from 'lucide-react';
// Removed Tailwind CSS plugin import


// Notification Component
interface NotificationProps {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}

const Notification = ({ type, message, onClose }: NotificationProps) => {
  return (
    <div
      className={`
        fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg
        ${type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
        transition-all duration-300 ease-in-out animate-slide-in
      `}
    >
      {type === 'success' ? (
        <CheckCircle className="mr-2" size={24} />
      ) : (
        <AlertCircle className="mr-2" size={24} />
      )}
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-4 text-xs hover:bg-gray-200 rounded-full p-1"
      >
        ✕
      </button>
    </div>
  );
};

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  interface NotificationState {
    type: 'success' | 'error';
    message: string;
  }

  const [notification, setNotification] = useState<NotificationState | null>(null);
  const router = useRouter();

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 5000); // Notification disappears after 5 seconds
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
        // Appel à la route API de Next.js
        const response = await axios.post('/api/login', { username, password });

        if (response.data.token) {
            // Enregistrer le token dans le stockage local
            localStorage.setItem("jwtToken", response.data.token);
            login(response.data.token);

            // Show success notification
            showNotification('success', `Bienvenue ! Vous êtes bien connecté à votre compte.`);

            // Redirect after a short delay to allow notification to be seen
            setTimeout(() => {
              router.push("/profile");
            }, 2000);
        }
    } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response) {
            console.error("Login error:", err.response.data);
            // Show error notification
            showNotification('error', 'Connexion échouée. Veuillez recommencer.');
        } else {
            console.error("Unexpected error:", err);
            showNotification('error', 'Oops! Une erreur s\'est produite. Veuillez réessayer.');
        }
        setError("Oops! Une erreur s'est produite. Veuillez réessayer.");
    }
  };

  return (
    <div className="relative">
      {/* Notification Component */}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="sx-container !mt-48">
        <h2 className="text-gray-950">Se Connecter</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Nom d'utilisateur ou email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            className="bg-gradient-to-r from-primary to-primary text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-rose-800 hover:text-white"
            type="submit"
          >
            Connectez-vous
          </button>
        </form>
        <span className="text-xs text-center flex mt-4 italic">
          En continuant, vous acceptez les conditions d&apos;utilisation de Mémé Georgette et reconnaissez avoir lu notre Politique de confidentialité. Informations concernant la collecte de données.
        </span>
        <a href="/signup" className="link text-xs font-semibold">Pas encore de compte? Inscrivez-vous</a>
        <a href="https://portailpro-memegeorgette.com/mon-compte/lost-password" className="link text-xs font-semibold">Mot de passe oublié?</a>
      </div>
      <br />
      <br />
    </div>
  );
}


// Removed Tailwind CSS configuration
