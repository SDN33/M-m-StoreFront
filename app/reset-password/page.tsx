"use client";

import { useState, Suspense } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();
  const resetToken = searchParams ? searchParams.get("token") : null;

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      // Call the Next.js API route instead of the WordPress API directly
      await axios.post('/api/reset-password', { token: resetToken, password });

      setMessage("Mot de passe réinitialisé avec succès.");
    } catch (err) {
      console.error("Reset password error:", err);
      setMessage("Mot de passe non réinitialisé. Veuillez réessayer.");
    }
  };

  return (
    <div>
      {message && <p>{message}</p>}
      <form onSubmit={handleResetPassword}>
        <input
          type="password"
          placeholder="Entrez votre nouveau mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Réinitialiser le mot de passe</button>
      </form>
      <a href="/login" className="link">Retour à la page de connexion</a>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="sx-container">
      <h2>Réinitialiser le mot de passe</h2>
      <Suspense fallback={<div>Chargement...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
