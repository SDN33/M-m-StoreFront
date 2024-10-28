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
        // Call the Next.js API route instead of the WordPress API directly
        const response = await axios.post('/api/login', { username, password });

        if (response.data.token) {
            // Save token to local storage
            localStorage.setItem("jwtToken", response.data.token);
            login(response.data.token); // Custom login function to update auth state
            router.push("/profile");
        }
    } catch (err) {
        setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="sx-container">
      <h2>Login</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <a href="/signup" className="link">Don’t have an account? Sign up</a>
      <a href="/forgot-password" className="link">Forgot Password?</a>
    </div>
  );
}
