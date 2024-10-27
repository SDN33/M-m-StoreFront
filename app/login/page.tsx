"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_WC_API_DOMAIN}/wp-json/les-vins-auth/v1/token`, {
        username,
        password,
      });
      localStorage.setItem("jwtToken", response.data.token);
      localStorage.setItem("userData", JSON.stringify(response.data));
      router.push("/profile");
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
