//https://daisyui.com/components/card/

import React from "react";
import Image from "next/image";
import Button from "./Button.jsx";

function ProductCard({productName, productStore, storeZipCode, productPrice}) {
    return (
        <div className="card bg-base-200 w-96 shadow-sm">
    <figure className="px-10 pt-10">
        <Image
        src="/images/stockeggs.jpg"
        width={500}
        height={500}
        alt="Stock image of Eggs"
        className="rounded-xl" />
    </figure>
    <div className="card-body items-center text-center">
        <h2 className="card-title">{productName} - ${productPrice}</h2>
        <p> {productStore}, {storeZipCode} </p>
        <div className="card-actions">
        <Button text="Add to list" className="btn btn-primary w-30" />
        </div>
    </div>
    </div>
    );
}

export default ProductCard