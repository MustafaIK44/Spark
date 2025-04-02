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
        setShoppingList(prevList => [...prevList, product]);
    };

    const enhancedChildren = React.Children.map(children, child =>
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
                    <ul className="list-disc list-inside space-y-2">
                        {shoppingList.map((item, index) => (
                            <li key={index}>
                                {item.name} - {item.price} ({item.store})
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default ShoppingList;
