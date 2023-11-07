import React from "react";
import {useQuery} from "@tanstack/react-query";
import {getProducts} from "./api/firebase";
import ProductCard from "./components/ProductCard";

export default function Products() {
  const {isLoading, error, data: products} = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });
  return (
    <div>
      {isLoading && <p>Loading</p>}
      {error && <p>{error}</p>}
      <ul className='grid grid-cols-1 md:grid-cols-3 lg-grid-cols-4 gap-4 p-4'>
        {
          products && products.map(product => (<ProductCard key={product.id} product={product}/>
          ))}
      </ul>
    </div>
  );
}
