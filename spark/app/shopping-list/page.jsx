'use client';

import React, { useState, useEffect } from "react";
import HamburgerMenu from "@/components/HamburgerMenu";
import ShoppingList from "@/components/ShoppingList";

import './page.css';

export default function ShoppingListPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Account", path: "/account" },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4">
      {/* Hamburger menu */}
      <div className="flex justify-end p-4 no-print">
        <HamburgerMenu navItems={navItems} buttonLabel="☰" />
      </div>

      {/* Spark logo (for print only) */}
      {isClient && (
        <div className="print-only flex justify-center mb-6">
          <img
            src="/images/anan.png"
            alt="Spark Logo"
            className="h-20 object-contain"
          />
        </div>
      )}

      {/* Header + Print button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Your Shopping List</h1>
        {isClient && (
          <button
            onClick={handlePrint}
            className="btn btn-outline btn-primary no-print"
          >
            🖨️ Print
          </button>
        )}
      </div>

      {/* Shopping list content */}
      <div id="shopping-list-section">
        <ShoppingList />
      </div>
    </div>
  );
}
