"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");

      try {
          // Call the Next.js API route instead of the WordPress API directly
          await axios.post('/api/register', { username, email, password });

          router.push("/login"); // Redirect to the login page after successful signup
      } catch (err) {
          console.error("Signup error:", err);
          setError("Inscription échouée. Veuillez réessayer.");
      }
  };

  return (
    <div className="sx-container">
      <h2 className="text-primary">S&apos;inscrire</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="bg-gradient-to-r from-primary to-rose-800 text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-rose-800 hover:text-white" type="submit">S&apos;inscrire</button>
      </form>
      <span className="text-xs text-center flex mt-2 italic">En continuant, vous acceptez les conditions d&apos;utilisation de Mémé Georgette et reconnaissez avoir lu notre Politique de confidentialité. Informations concernant la collecte de données.</span>
      <a href="/login" className="link">Vous avez déjà un compte? Connectez-vous</a>
    </div>
  );
}
