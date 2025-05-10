'use client';

import Header from "@/components/Header";
import React from "react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-items-center sm:p-5 font-[family-name:var(--font-geist-sans)]">
      <div className="row-start-2">
        <Header />
      </div>
    </div>
  );
}