import { useState, useEffect, useCallback } from "react";
import { displayMenuList as displayMenuListService} from "../../service/productService";


const useDisplayMenuList = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchListOfProduct = useCallback ( async () => {
        try{
            setIsLoading(true);

            const product = await displayMenuListService();
            setProducts(product.data);
            
        }catch(error){
            console.error("Unable to fetch list of products", error);
        }finally{
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchListOfProduct();
    }, [fetchListOfProduct]);

    return {
        products,
        isLoading
    }
}

export default useDisplayMenuList;