import { useEffect, useState, useCallback } from "react";
import { displayProduct } from "../service/productService";


export const useGetProduct = () => {
    const [product, setProduct] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchProduct = useCallback(async () => {
        try{
            const allProduct = await displayProduct();
            
            setProduct(allProduct.data);
            console.log(allProduct.data);
            

        }catch(error){
            console.error(error);
            
        }finally{
            setIsLoading(false);
        }
    }, []);

      useEffect(() => {
        const fetchProduct = async () => {

            try{
                const allProduct = await displayProduct();
                
                setProduct(allProduct.data);
                console.log(allProduct.data);
                

            }catch(error){
                console.error(error);
                
            }finally{
                setIsLoading(false);
            }
        }

        fetchProduct();
    }, []);

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    return {
        isLoading,
        product,
        refetch: fetchProduct
    }
  
}