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
      setMessage(err.message || "Google login failed");
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center sm:p-5">
      <div className= "w-full max-w-6xl p-6 bg-base-300 rounded-xl shadow-md flex flex-row items-center justify-center gap-6"> 
        <div className="flex-none"> <HamburgerMenu navItems={navItems} buttonLabel="☰" /> </div>
        <h1 className="text-5xl font-bold">Log into </h1>
        <img src="../images/anan.png" alt="Spark Logo" className="logo"/>
      </div>
      
      <div className="w-full items-center m-5 max-w-4xl p-5 gap-4 bg-base-200 shadow-md rounded-xl"> 
        <form onSubmit={handleLogin} className="text-xl space-y-4">
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
        <button type="submit" className="bg-blue-600 text-xl text-white px-4 py-2 rounded">
          Login
        </button>
      </form>

      <button
        onClick={handleGoogleLogin}
        className="bg-red-500 text-xl text-white px-3 py-3 mt-3 mb-3 rounded w-full"
      >
        Sign in with Google
      </button>

      {message && <p className="text-sm ">{message}</p>}

      <p className="text-sm">
        Don’t have an account?{" "}
        <Link href="/register" className="text-blue-600 hover:underline">
          Create one here
        </Link>
      </p>
      </div>

      
    </div>
  );
}
