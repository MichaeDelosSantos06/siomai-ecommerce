import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { addToCart as addToCartService } from "../service/cartService";
import { readItems as readItemsService } from "../service/cartService";
import { useAuth } from "./authContext";

const CartContext = createContext(null);

export const useCart = () => {
    const context = useContext(CartContext);

    if(!context){
        throw new Error("useCart must be used within CartProvider");
    }
    return context;
}

export const CartProvider = ({children}) => {
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();
      
    const addToCart = useCallback( async (id) => {
        try{
            const response = await addToCartService(id);
            const item = response.data;
            
            setCartItems((prev) => {
                // check if the id is existing
                const existing = prev.find((i) => i.product?.id === item.product?.id);

                if(existing){
                    return prev.map(i => 
                        i.product?.id === item.product?.id
                        ? item
                        : i
                    )
                }

                return [...prev, item]
            });
        }catch(error){
            console.error(error);
            
        }
    }, []);


    useEffect(() => {
        const fetchCartItem = async () => {
            try{
                setIsLoading(true);

                if(!user){
                    setCartItems([]);
                    return
                }

                const response = await readItemsService();
                console.log("THE DATA:", response.data);
                
                setCartItems(response.data ?? []);
            }catch(error){
                console.error("Failed to fetch items:", error);
                setCartItems([]);
            }finally{
                setIsLoading(false)
            }
        }

        fetchCartItem();
    }, [user]);

    const value = {
        addToCart,
        cartItems,
        isLoading
    }

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    )
}
