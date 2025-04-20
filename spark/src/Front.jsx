import React , { useEffect, useState }from "react";
import './Front.css';
import ProductCard from "./components/ProductCard.jsx";
import { collection, doc, getDocs } from "firebase/firestore";
import { useCollection, useDocument} from "../libs/firebase/userFirestore"

function Front({zip, search, onAdd}) {
  
  const { data: products, loading, error } = useCollection(`test/batch test/${zip}/MockInfo/${search}`); //need to change this collection!
  return (
    <div className="product-grid">
      {products.length > 0 ? ( 
        products.map((product) => (
          <ProductCard
            key={product.Image}
            productName={product.Title}
            productStore={product.id}
            storeZipCode={zip}
            productPrice={product.Price}
            productImage={product.Image}
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
              storeZipCode={zip}
              productPrice={"$3.45"}
              productImage={"../images/stockeggs.jpg"}
              onAdd={onAdd}
            />
            <ProductCard
              key={'2'}
              productName={'Apples'}
              productStore={'Walmart'}
              storeZipCode={zip}
              productPrice={"$3.56"}
              productImage={"https://i5.walmartimages.com/seo/Fresh-Gala-Apples-3-lb-Bag_eebbaadc-2ca6-4e25-a2c0-c189d4871fea.bcbe9a9c422a1443b7037548bb2c54c3.jpeg?odnHeight=2000&odnWidth=2000&odnBg=FFFFFF"}
              onAdd={onAdd}
            />
            <ProductCard
              key={'3'}
              productName={'Bread'}
              productStore={'Target'}
              storeZipCode={zip}
              productPrice={"$3.69"}
              productImage={"https://target.scene7.com/is/image/Target/GUEST_7f66fe99-fbd3-4131-864e-250aed06c274?wid=1200&hei=1200&qlt=80&fmt=webp"}
              onAdd={onAdd}
            />  
             <ProductCard
              key={'4'}
              productName={'Cereal'}
              productStore={'Walmart'}
              storeZipCode={zip}
              productPrice={"$4.93"}
              productImage={"https://i5.walmartimages.com/seo/Cinnamon-Toast-Crunch-Breakfast-Cereal-Crispy-Cinnamon-Cereal-Family-Size-18-8-oz_b4be9560-dd1c-433c-8585-d14a96045834.dd3fe5ec041aed6f593f78be739720cd.jpeg?odnHeight=640&odnWidth=640&odnBg=FFFFFF"}
              onAdd={onAdd}
            />  
            <ProductCard
              key={'5'}
              productName={'Banana'}
              productStore={'Target'}
              storeZipCode={zip}
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