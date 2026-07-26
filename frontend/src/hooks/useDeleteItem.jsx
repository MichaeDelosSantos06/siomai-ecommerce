import { useState } from "react";
import { deleteItem as deleteItemService} from "../service/productService";

const useDeleteItem = () => {
    const [isLoading, setIsLoading] = useState(false);

    const deleteItem = async(productId) => {
        setIsLoading(true);

        try{
            await deleteItemService(productId);

        }catch(error){
            console.error(error); 
        }finally{
            setIsLoading(false);
        }
    }

    return {
        deleteItem,
        isLoading
    }
}

export default useDeleteItem;


// PATTERN 