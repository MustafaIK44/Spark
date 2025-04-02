import React , { useEffect, useState }from "react";
import './Front.css';
import ProductCard from "./components/ProductCard.jsx";
import { collection, doc, getDocs } from "firebase/firestore";
import { useCollection, useDocument} from "../libs/firebase/userFirestore"

function Front({search, onAdd}) {



   const { data: products, loading, error } = useCollection(`test/batch test/22030/MockInfo/${search}`);

  console.log("Products:", products);

  return (
    <div className="product-grid">
        
        {products.length > 0 ? (
          products.map((product) => (
              <ProductCard
                  key={product.Image}
                  productName={product.Title}
                  productStore={product.id}
                  storeZipCode={"22030"}
                  productPrice={product.Price}
                  productImage={product.Image}
                  onAdd={onAdd}
              />
          ))
      ) : (
          <p>No products found.</p>
      )}
    </div>
  );
}

export default Front;