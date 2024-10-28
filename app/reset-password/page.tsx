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

      setMessage("Password reset successful.");
    } catch (err) {
      console.error("Reset password error:", err);
      setMessage("Password reset failed. Please try again.");
    }
  };

  return (
    <div>
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

export default function ResetPasswordPage() {
  return (
    <div className="sx-container">
      <h2>Reset Password</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
