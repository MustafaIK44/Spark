import React , { useEffect, useState }from "react";
import './Front.css';
import ProductCard from "./components/ProductCard.jsx";
import { getAllItems, getItemsOnSearch } from "../libs/firebase/itemDisplay";
import { collection, doc, getDocs } from "firebase/firestore";
import { useCollection, useDocument} from "../libs/firebase/userFirestore"

function Front({search, onAdd}) {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchedProducts, setSearchedProducts] = useState([]);
  let count = 0;
  useEffect(() => {
          async function loadItems() {
            console.log("loading data");
            const cachedProducts = localStorage.getItem("products")
            if(cachedProducts){
              console.log("cached: ", cachedProducts);
              setProducts(JSON.parse(cachedProducts));
              setSearchedProducts(JSON.parse(cachedProducts));
            } else {
              const items = await getAllItems();
            // Assume each item has a 'name' property for display purposes.
              if (items) {
                const mappedItems = items.map((item) => ({price: item.price, imageLink: item.url, name: item.itemName, store: item.store, zipcode: item.zipcode}));
                setProducts(mappedItems);
                setSearchedProducts(mappedItems)
                localStorage.setItem("products", JSON.stringify(mappedItems));
              }
            } 
          }
          loadItems(); 
        }, []);

        useEffect(() => {
          if ((search.trim !== "")){
            const lowercaseSearch = search.toLowerCase();
            setSearchedProducts(products.filter(product => product.name && product.name.toLowerCase().includes(lowercaseSearch)));
          }
          else{
            setSearchedProducts(products);
          }
        }, [search, products]);
  console.log("Searched Products: ", searchedProducts[0])
  return (
    <div className="product-grid">
      {searchedProducts.length > 0 ? ( 
        searchedProducts.map((product) => (
          <ProductCard  
            key={count++}
            productName={product.name}
            productStore={product.store}
            storeZipCode={product.zipcode}
            productPrice={product.price}
            productImage={product.imageLink}
            onAdd={onAdd}
          />
        ))
      ) : ( 
          <p>No Product Found!</p>
        )}
      
    </div>
  );
}

export default Front;