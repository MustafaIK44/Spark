"use client"

import App from "../src/App.jsx"
import Header from "../src/components/Header.jsx";

export default function Home() {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] grid-rows-[10px_1fr_10px] items-center justify-items-center min-h-screen p- pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="row-start-2">
        <App />
      </div>
    </div>
  );
}
