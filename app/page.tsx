
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/^[^\s@]+@gmail\.com$/i.test(email.trim())) {
      setError("Please enter a valid @gmail.com email.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    // Save a simple demo login session.
    localStorage.setItem("neonUser", email.trim());
    router.push("/notes");
  }

  return (
    <main className="login-page">
      <div className="login-card">
        <div className="logo">N<span>.</span></div>

        <p className="eyebrow">YOUR PERSONAL SPACE</p>
        <h1>Welcome <span>back.</span></h1>
        <p className="subtitle">
          Your thoughts deserve a place to glow.
        </p>

        <form onSubmit={handleLogin}>
          <label htmlFor="email">EMAIL ADDRESS</label>
          <input
            id="email"
            type="email"
            placeholder="you@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password">PASSWORD</label>
          <input
            id="password"
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="neon-button" type="submit">
            Enter your space <span>↗</span>
          </button>

          {error && (
            <p className="error-message" role="alert">
              ✦ {error}
            </p>
          )}
        </form>

        <div className="login-footer">
          <span className="status-dot" />
          Your little neon note space
        </div>
      </div>

      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
    </main>
  );
}
