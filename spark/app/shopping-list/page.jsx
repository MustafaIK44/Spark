'use client';

import React, { useEffect, useState } from "react";
import HamburgerMenu from "@/components/HamburgerMenu";

export default function ShoppingListPage() {
    const [shoppingList, setShoppingList] = useState([]);

    // Load list from localStorage
    useEffect(() => {
        const stored = localStorage.getItem("shoppingList");
        if (stored) {
            setShoppingList(JSON.parse(stored));
        }
    }, []);

    // Save list to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
    }, [shoppingList]);

    // Remove item by index
    const handleRemove = (indexToRemove) => {
        const updatedList = shoppingList.filter((_, index) => index !== indexToRemove);
        setShoppingList(updatedList);
    };

    const navItems = [
        { label: "Home", path: "/" },
        { label: "About", path: "/about" },
    ];

    return (
        <div className="p-4">
            <div className="flex justify-end p-4">
                <HamburgerMenu navItems={navItems} buttonLabel="☰" />
            </div>

            <h1 className="text-2xl font-bold mb-4">Your Shopping List</h1>

            {shoppingList.length === 0 ? (
                <p className="text-gray-500">You haven't added anything yet.</p>
            ) : (
                <ul className="space-y-4">
                    {shoppingList.map((item, index) => (
                        <li
                            key={index}
                            className="flex justify-between items-center p-4 bg-base-200 rounded shadow"
                        >
                            <div>
                                <p className="font-semibold">{item.name} - {item.price}</p>
                                <p className="text-sm text-gray-500">{item.store}, {item.zip}</p>
                            </div>
                            <button
                                onClick={() => handleRemove(index)}
                                className="btn btn-error btn-sm"
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
