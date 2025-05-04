'use client';
import React, { useState, useEffect } from "react";

function ShoppingList() {
  const [shoppingList, setShoppingList] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false); // ✅ track localStorage load

  // Load shopping list from localStorage on first render
  useEffect(() => {
    const stored = localStorage.getItem("shoppingList");
    console.log("📦 Loaded from localStorage:", stored);
    if (stored) {
      setShoppingList(JSON.parse(stored));
    }
    setHasLoaded(true);
  }, []);

  // Only write to localStorage AFTER initial load
  useEffect(() => {
    if (hasLoaded) {
      localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
    }
  }, [shoppingList, hasLoaded]);

  // Handles removal of an item
  const handleRemove = (indexToRemove) => {
    const updatedList = shoppingList.filter((_, index) => index !== indexToRemove);
    setShoppingList(updatedList);
  };

  return (
    <div className="w-full p-4 bg-base-100 shadow-lg rounded-lg">
      {shoppingList.length === 0 ? (
        <p className="text-gray-500">No items added yet.</p>
      ) : (
        Array.from(
          shoppingList.reduce((grouped, item) => {
            if (!grouped.has(item.store)) grouped.set(item.store, []);
            grouped.get(item.store).push(item);
            return grouped;
          }, new Map())
        )
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([store, items]) => (
            <div key={store}>
              <h3 className="font-bold text-lg mt-4">{store}</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                {items.map((item, index) => (
                  <li key={`${store}-${index}`} className="flex justify-between items-center">
                    <div>
                      {item.name} - {item.price}
                    </div>
                    <button
                      onClick={() => handleRemove(shoppingList.indexOf(item))}
                      className="btn btn-error btn-xs no-print ml-4"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))
      )}
    </div>
  );
}

export default ShoppingList;
