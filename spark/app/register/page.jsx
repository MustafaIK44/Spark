"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import HamburgerMenu from "@/components/HamburgerMenu";
import Link from "next/link";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../libs/firebase/config";

export default function RegisterPage() {
  const router = useRouter();

  const navItems = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Shopping List", path: "/shopping-list" },
  ];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/register", {
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
      setMessage(`Registered as ${user.email}`);
      router.push("/");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <HamburgerMenu navItems={navItems} buttonLabel="☰" />
      <h1 className="text-2xl font-bold mb-4">Register</h1>

      <form onSubmit={handleRegister} className="space-y-4">
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
          placeholder="Password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Register
        </button>

        <button
          onClick={handleGoogleLogin}
          type="button"
          className="bg-red-500 text-white px-4 py-2 rounded mt-4 w-full"
        >
          Sign up with Google
        </button>
      </form>

      <p className="text-sm mt-4">
        Already have an account?{" "}
        <Link href="/account" className="text-blue-600 hover:underline">
          Log in here
        </Link>
      </p>

      {message && <p className="text-sm mt-2">{message}</p>}
    </div>
  );
}
