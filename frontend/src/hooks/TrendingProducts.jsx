import { useEffect, useState } from "react";
import { displayHotPicks } from "../service/productService";

export const useHotPicks = () => {
    const [product, setProduct] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        const fetchHotPicks = async () => {
            try{
                const hotProduct = await displayHotPicks();
                setProduct(hotProduct.data);
                
            }catch(error){
                console.error(error);
            }finally{
                setIsLoading(false);
            }
        }

        fetchHotPicks();
    }, []);

    return {
        product,
        isLoading
    }
}