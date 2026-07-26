
import { useState } from "react";
import { addProduct } from "../service/productService"


const useAddProduct = () => {
    const [isLoading, setIsLoading] = useState(true);

    const addNewProduct = async (formData) => {
        try{
            await addProduct(formData);

        }catch(error){
            console.error(error);
            
        }finally{
            setIsLoading(false);
        }
    }

    return {
        isLoading,
        addNewProduct
    }
}

export default useAddProduct;