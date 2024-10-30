"use client";

import { useState } from "react";
import axios from "axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleForgotPassword = async (e: React.FormEvent) => {
      e.preventDefault();
      setMessage("");

      try {
          await axios.post('/api/forgot-password', { email });
          setMessage("Le lien de réinitialisation a été envoyé à votre adresse e-mail.");
      } catch {
          setMessage("Une erreur s'est produite. Veuillez réessayer.");
      }
  };

  return (
    <div className="sx-container">
      <h2 className="text-primary">Mot de passe oublié</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleForgotPassword}>
        <input
          type="email"
          placeholder="Entrer votre adresse e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="bg-gradient-to-r from-primary to-rose-500 text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-rose-800 hover:text-white" type="submit">Envoyer le lien de réinitialisation</button>
      </form>
      <a href="/login" className="link">Retour à la page de connexion</a>
    </div>
  );
}
