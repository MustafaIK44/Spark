'use client';

import React, { useEffect, useState } from "react";
import HamburgerMenu from "@/components/HamburgerMenu";

export default function ShoppingListPage() {
    const [shoppingList, setShoppingList] = useState([]);
    const [isClient, setIsClient] = useState(false);

    // Confirm we're on the client
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Load list from localStorage
    useEffect(() => {
        const stored = localStorage.getItem("shoppingList");
        console.log("📦 Loaded from localStorage on shopping-list page:", stored);
        if (stored) {
            setShoppingList(JSON.parse(stored));
        }
    }, []);

    const handleRemove = (indexToRemove) => {
        const updatedList = shoppingList.filter((_, index) => index !== indexToRemove);
        setShoppingList(updatedList);
        localStorage.setItem("shoppingList", JSON.stringify(updatedList));
    };

    // Trigger browser print dialog
    const handlePrint = () => {
        window.print();
    };

    const navItems = [
        { label: "Home", path: "/" },
        { label: "About", path: "/about" },
    ];

    return (
        <div className="p-4">
            <div className="flex justify-end p-4 no-print">
                <HamburgerMenu navItems={navItems} buttonLabel="☰" />
            </div>

            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Your Shopping List</h1>
                {isClient && shoppingList.length > 0 && (
                    <button
                        onClick={handlePrint}
                        className="btn btn-outline btn-primary no-print"
                    >
                        🖨️ Print
                    </button>
                )}
            </div>

            {shoppingList.length === 0 ? (
                <p className="text-gray-500">You haven't added anything yet.</p>
            ) : (
                <div id="shopping-list-section" className="space-y-6">
                    {Array.from(
                        shoppingList.reduce((grouped, item) => {
                            if (!grouped.has(item.store)) {
                                grouped.set(item.store, []);
                            }
                            grouped.get(item.store).push(item);
                            return grouped;
                        }, new Map())
                    )
                        .sort((a, b) => a[0].localeCompare(b[0]))
                        .map(([store, items]) => (
                            <div key={store}>
                                <h2 className="text-xl font-bold">{store}</h2>
                                <ul className="space-y-2 mt-2">
                                    {items.map((item, index) => (
                                        <li
                                            key={`${store}-${index}`}
                                            className="flex justify-between items-center p-4 bg-base-200 rounded shadow"
                                        >
                                            <div>
                                                <p className="font-semibold">
                                                    {item.name} - {item.price}
                                                </p>
                                                <p className="text-sm text-gray-500">{item.zip}</p>
                                            </div>
                                            <button
                                                onClick={() => handleRemove(shoppingList.indexOf(item))}
                                                className="btn btn-error btn-sm no-print"
                                            >
                                                Remove
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
}
