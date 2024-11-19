"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
        // Appel à la route API de Next.js
        const response = await axios.post('/api/login', { username, password });

        if (response.data.token) {
            // Enregistrer le token dans le stockage local
            localStorage.setItem("jwtToken", response.data.token);
            login(response.data.token); // Fonction de connexion personnalisée pour mettre à jour l'état d'authentification
            router.push("/profile");
        }
    } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response) {
            console.error("Login error:", err.response.data);
        } else {
            console.error("Unexpected error:", err);
        }
        setError("Oops! Une erreur s'est produite. Veuillez réessayer.");
    }
  };

  return (
    <div className="sx-container mt-60">
      <h2 className="text-primary">Se connecter</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Nom d'utilisateur"
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
        <button className="bg-gradient-to-r from-primary to-rose-500 text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-rose-800 hover:text-white" type="submit">Connectez-vous</button>
      </form>
      <span className="text-xs text-center flex mt-2 italic">En continuant, vous acceptez les conditions d&apos;utilisation de Mémé Georgette et reconnaissez avoir lu notre Politique de confidentialité. Informations concernant la collecte de données.</span>
      <a href="/signup" className="link">Pas encore de compte? Inscrivez-vous</a>
      <a href="/forgot-password" className="link">Mot de passe oublié?</a>
    </div>
  );
}
