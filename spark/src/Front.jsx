import React , { useEffect, useState }from "react";
import './Front.css';
import ProductCard from "./components/ProductCard.jsx";
import { getAllItems, getItemsOnSearch } from "../libs/firebase/itemDisplay";
import { collection, doc, getDocs } from "firebase/firestore";
import { useCollection, useDocument} from "../libs/firebase/userFirestore"

function Front({search, zip, onAdd}) {
  console.log("selected zip: ", zip);
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
                const mappedItems = items.map((item) => ({price: item.price, imageURL: item.imageURL, url: item.url, itemName: item.itemName, store: item.store, zipcode: item.zipcode}));
                setProducts(mappedItems);
                setSearchedProducts(mappedItems)
                localStorage.setItem("products", JSON.stringify(mappedItems));
              }
            } 
          }
          loadItems(); 
        }, []);

        useEffect(() => {
          if ((search.trim() !== "")){
            const lowercaseSearch = search.toLowerCase();
            if(zip !== ""){
              setSearchedProducts(products.filter(product => product.itemName && product.itemName.toLowerCase().includes(lowercaseSearch) && product.zipcode === zip));
            } else {
              setSearchedProducts(products.filter(product => product.itemName && product.itemName.toLowerCase().includes(lowercaseSearch)));
            }
          }
          else{
            setSearchedProducts(products);
          }
        }, [search, zip, products]);

  console.log("searched products length: ", searchedProducts.length);
  console.log("Searched Products: ", searchedProducts[200]);

  return (
    <div className="product-grid">
      {searchedProducts.length > 0 ? ( 
        searchedProducts.map((product) => (
          <ProductCard  
            key={count++}
            productName={product.itemName}
            productStore={product.store}
            storeZipCode={product.zipcode}
            productPrice={product.price}
            productImage={product.imageURL}
            onAdd={onAdd}
          />
        ))
      ) : ( 
        search.trim() === "" ? ( // Ensure an empty search still displays the default products in grid
          <>
            <ProductCard
              key={'1'}
              productName={'Eggs'}
              productStore={'Target'}
              storeZipCode={'22030'}
              productPrice={"$3.45"}
              productImage={"../images/stockeggs.jpg"}
              onAdd={onAdd}
            />
            <ProductCard
              key={'2'}
              productName={'Apples'}
              productStore={'Walmart'}
              storeZipCode={'22030'}
              productPrice={"$3.56"}
              productImage={"https://i5.walmartimages.com/seo/Fresh-Gala-Apples-3-lb-Bag_eebbaadc-2ca6-4e25-a2c0-c189d4871fea.bcbe9a9c422a1443b7037548bb2c54c3.jpeg?odnHeight=2000&odnWidth=2000&odnBg=FFFFFF"}
              onAdd={onAdd}
            />
            <ProductCard
              key={'3'}
              productName={'Bread'}
              productStore={'Target'}
              storeZipCode={'22030'}
              productPrice={"$3.69"}
              productImage={"https://target.scene7.com/is/image/Target/GUEST_7f66fe99-fbd3-4131-864e-250aed06c274?wid=1200&hei=1200&qlt=80&fmt=webp"}
              onAdd={onAdd}
            />  
             <ProductCard
              key={'4'}
              productName={'Cereal'}
              productStore={'Walmart'}
              storeZipCode={'22030'}
              productPrice={"$4.93"}
              productImage={"https://i5.walmartimages.com/seo/Cinnamon-Toast-Crunch-Breakfast-Cereal-Crispy-Cinnamon-Cereal-Family-Size-18-8-oz_b4be9560-dd1c-433c-8585-d14a96045834.dd3fe5ec041aed6f593f78be739720cd.jpeg?odnHeight=640&odnWidth=640&odnBg=FFFFFF"}
              onAdd={onAdd}
            />  
            <ProductCard
              key={'5'}
              productName={'Banana'}
              productStore={'Target'}
              storeZipCode={'22030'}
              productPrice={"$1.99"}
              productImage={"https://target.scene7.com/is/image/Target/GUEST_8162d58e-0a2f-4aaf-88e8-a488bab34269?wid=1200&hei=1200&qlt=80&fmt=webp"}
              onAdd={onAdd}
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