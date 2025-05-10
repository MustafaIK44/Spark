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
      setMessage(err.message || "Google sign-in failed");
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
        <form onSubmit={handleRegister} className="text-xl space-y-4">
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
        <button type="submit" className="bg-green-600 text-xl text-white px-4 py-2 rounded">
          Register
        </button>

        <button
          onClick={handleGoogleLogin}
          type="button"
          className="bg-red-500 text-xl text-white px-4 py-2 rounded  mb-0 mt-4 w-full"
        >
          Sign up with Google
        </button>
      </form>

      <p className="text-sm mt-0">
        Already have an account?{" "}
        <Link href="/account" className="text-blue-600 hover:underline">
          Log in here
        </Link>
      </p>

      {message && <p className="text-sm mt-0">{message}</p>}
      </div>
    </div>
  );
}
