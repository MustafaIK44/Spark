"use client"

import App from "../src/App.jsx"
import Header from "../src/components/Header.jsx";

export default function Home() {
  return (
    <div className="items-center justify-items-center gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div>
        <img src="../images/anan.png" alt="" className="logo"/>
      </div>
      <div className="row-start-2">
        <App />
      </div>
    </div>
  );
}
