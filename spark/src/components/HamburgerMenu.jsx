"use client";

import React from "react";
import { useRouter } from "next/navigation";

function HamburgerMenu({ navItems, buttonLabel = "☰" }) {
    const router = useRouter();
    const drawerId = "hamburger-drawer";

    const handleNavigation = (path) => {
        router.push(path);
        document.getElementById(drawerId).checked = false; // close drawer
    };

    return (
        <div className="drawer drawer-end z-50">
            <input id={drawerId} type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                <label htmlFor={drawerId} className="btn btn-ghost text-xl drawer-button">
                    {buttonLabel}
                </label>
            </div>

            <div className="drawer-side">
                <label htmlFor={drawerId} className="drawer-overlay"></label>
                <div className="menu p-4 w-80 bg-base-200 text-base-content rounded-b-lg shadow">

                    <h2 className="text-lg font-bold mb-4">Menu</h2>
                    <ul className="space-y-2">
                        {navItems.map((item, index) => (
                            <li key={index}>
                                <button
                                    onClick={() => handleNavigation(item.path)}
                                    className="btn btn-block btn-ghost justify-start text-left"
                                >
                                    {item.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default HamburgerMenu;
