import React, { useState, useEffect, cloneElement } from "react";

function ShoppingList({ children }) {
    const [shoppingList, setShoppingList] = useState([]);

    // Load from localStorage on first render
    useEffect(() => {
        const stored = localStorage.getItem("shoppingList");
        if (stored) {
            setShoppingList(JSON.parse(stored));
        }
    }, []);

    // Save to localStorage whenever list changes
    useEffect(() => {
        localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
    }, [shoppingList]);

    const handleAddToList = (product) => {
        setShoppingList((prevList) => [...prevList, product]);
    };

    const enhancedChildren = React.Children.map(children, (child) =>
        cloneElement(child, { onAdd: handleAddToList })
    );

    return (
        <div className="flex gap-6">
            <div className="flex flex-col gap-4">
                {enhancedChildren}
            </div>

            <div className="w-1/2 p-4 bg-base-100 shadow-lg rounded-lg">
                <h2 className="text-xl font-bold mb-4">Shopping List</h2>
                {shoppingList.length === 0 ? (
                    <p className="text-gray-500">No items added yet.</p>
                ) : (
                    Array.from(
                        shoppingList.reduce((grouped, item) => {
                            if (!grouped.has(item.store)) {
                                grouped.set(item.store, []);
                            }
                            grouped.get(item.store).push(item);
                            return grouped;
                        }, new Map())
                    )
                        .sort((a, b) => a[0].localeCompare(b[0])) // sort by store name
                        .map(([store, items]) => (
                            <div key={store}>
                                <h3 className="font-bold text-lg mt-4">{store}</h3>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    {items.map((item, index) => (
                                        <li key={`${store}-${index}`}>
                                            {item.name} - {item.price}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))
                )}
            </div>
        </div>
    );
}

export default ShoppingList;
