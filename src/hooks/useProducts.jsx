import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {addNewProduct, getProducts as fetchProduct} from "../api/firebase";

export default function useProducts() {
  const queryClient = useQueryClient();
  
  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: fetchProduct,
    staleTime: 1000 * 60,
  });
  
  const addProduct = useMutation({
    
    mutationFn: ({product, url}) => addNewProduct(product, url),
    mutationKey: ['product', 'url'],
    onSuccess: () => queryClient.invalidateQueries(['products']),
  });
  
  return {productsQuery,addProduct}
}
