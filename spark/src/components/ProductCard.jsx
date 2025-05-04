//https://daisyui.com/components/card/

import React from "react";
import Image from "next/image";
import Button from "./Button.jsx";

function ProductCard({productName="Product Name", productStore="Store", storeZipCode="Zip", productPrice="0.00", productImage="/stockeggs.jpeg", onAdd}) {
    const handleAddClick = () => {
        if (onAdd) {
            onAdd({
                name: productName,
                store: productStore,
                zip: storeZipCode,
                price: productPrice,
                image: productImage
            });
        }
    };
    
    return (
        <div className="card bg-base-300 w-72 shadow-sm p-2">
            <figure className="px-10 pt-10">
            <img
                src={productImage}
                width={500}
                height={500}
                alt="Image unable to be displayed"
                className="rounded-xl " />
            </figure>
            <div className="card-body items-center text-center">
                <h2 className="card-title">{productName} - {productPrice}</h2>
                <p> {productStore}, {storeZipCode} </p>
                <div className="card-actions">
                <Button
                    onClick={handleAddClick}
                    text="Add to list"
                    className="btn btn-primary w-30"
                />

                </div>
            </div>
        </div>
    );
}

export default ProductCard