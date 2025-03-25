import React from "react";
import './Front.css';
import ProductCard from "./components/ProductCard.jsx";

function Front() {
  return (
    <div>
        <ProductCard productName={"Eggs"} productStore={"Giant"} storeZipCode={"22030"} productPrice={"10.99"}/>
    </div>
  );
}

export default Front;