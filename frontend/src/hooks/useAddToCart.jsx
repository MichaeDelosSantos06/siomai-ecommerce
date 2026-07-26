import { toast } from "sonner";
import { useState } from "react";
import { useCart } from "../context/cartContext";


const useAddToCart = () => {
    const { addToCart } = useCart();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const onClick = async (id) => {
        try{
            setIsLoading(true)
            setError(null);

            console.log("Product ID", id);
            
            await addToCart(id);
            toast.success("Product Added");

        }catch(error){
            setError(
                error.response?.data?.message || 
                error.message ||
                "Failed adding to cart"
            )
        }finally{
            setIsLoading(false);
        }
    }

    return {
        onClick,
        error,
        isLoading
    }
}

export default useAddToCart;