import React , { useEffect, useState }from "react";
import './Front.css';
import ProductCard from "./components/ProductCard.jsx";
import { collection, doc, getDocs } from "firebase/firestore";
import { useCollection, useDocument} from "../libs/firebase/userFirestore"

function Front({search}) {
  const { data: products, loading, error } = useCollection(`test/batch test/22030/MockInfo/${search}`);


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
          />
        ))
      ) : ( 
        search.trim() === "" ? ( // Ensure an empty search still displays the default products in grid
          <>
            <ProductCard
              key={'1'}
              productName={'Eggs'}
              productStore={'Target'}
              storeZipCode={"22030"}
              productPrice={"$3.45"}
              productImage={"../images/stockeggs.jpg"}
            />
            <ProductCard
              key={'2'}
              productName={'Eggs'}
              productStore={'Target'}
              storeZipCode={"22030"}
              productPrice={"$3.45"}
              productImage={"../images/stockeggs.jpg"}
            />
            <ProductCard
              key={'3'}
              productName={'Eggs'}
              productStore={'Target'}
              storeZipCode={"22030"}
              productPrice={"$3.45"}
              productImage={"../images/stockeggs.jpg"}
            />
            <ProductCard
              key={'4'}
              productName={'Eggs'}
              productStore={'Target'}
              storeZipCode={"22030"}
              productPrice={"$3.45"}
              productImage={"../images/stockeggs.jpg"}
            />
          </>
        ) : (
          <p>No Product Found!</p>
        )
      )}
    </div>
  );
}

export default Front;