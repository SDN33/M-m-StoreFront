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
      await axios.post(`${process.env.WC_API_DOMAIN}/wp-json/les-vins-auth/v1/register`, {
        username,
        email,
        password,
      });
      router.push("/login");
    } catch (err) {
      setError("Failed to register. Please try again.");
    }
  };

  return (
    <div className="sx-container">
      <h2>Signup</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Username"
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
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Signup</button>
      </form>
      <a href="/login" className="link">Already have an account? Login</a>
    </div>
  );
}
