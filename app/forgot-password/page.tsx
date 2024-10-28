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
          // Call the Next.js API route instead of the WordPress API directly
          await axios.post('/api/forgot-password', { email });
          
          setMessage("Password reset link sent. Please check your email.");
      } catch (err) {
          setMessage("Failed to send reset link. Try again.");
      }
  };

  return (
    <div className="sx-container">
      <h2>Forgot Password</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleForgotPassword}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Reset Link</button>
      </form>
      <a href="/login" className="link">Back to Login</a>
    </div>
  );
}
