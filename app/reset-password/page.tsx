"use client";

import { useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();
  const resetToken = searchParams.get("token");

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      await axios.post(`${process.env.WC_API_DOMAIN}/wp-json/les-vins-auth/v1/reset-password`, {
        token: resetToken,
        password,
      });
      setMessage("Password reset successful.");
    } catch (err) {
      setMessage("Password reset failed.");
    }
  };

  return (
    <div className="sx-container">
      <h2>Reset Password</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleResetPassword}>
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      <a href="/login" className="link">Back to Login</a>
    </div>
  );
}
