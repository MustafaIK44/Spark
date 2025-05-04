"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import HamburgerMenu from "@/components/HamburgerMenu";
import Link from "next/link";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../libs/firebase/config";

export default function AccountPage() {
  const router = useRouter();

  const navItems = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Shopping List", path: "/shopping-list" },
  ];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage(data.message);
      router.push("/");
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setMessage(`Logged in as ${user.email}`);
      router.push("/");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <HamburgerMenu navItems={navItems} buttonLabel="☰" />
      <h1 className="text-2xl font-bold mb-4">Login</h1>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Login
        </button>
      </form>

      <button
        onClick={handleGoogleLogin}
        className="bg-red-500 text-white px-4 py-2 rounded mt-4 w-full"
      >
        Sign in with Google
      </button>

      {message && <p className="text-sm mt-2">{message}</p>}

      <p className="text-sm mt-4">
        Don’t have an account?{" "}
        <Link href="/register" className="text-blue-600 hover:underline">
          Create one here
        </Link>
      </p>
    </div>
  );
}
