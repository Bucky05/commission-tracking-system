"use client";

import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async () => {
    const res = await fetch("http://localhost:3500/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!data.token) {
      alert("Login failed");
      return;
    }

    localStorage.setItem("token", data.token);

    const payload = JSON.parse(atob(data.token.split(".")[1]));

    if (payload.role === "brand") window.location.href = "/brand";
    if (payload.role === "creator") window.location.href = "/creator";
    if (payload.role === "admin") window.location.href = "/admin";
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}