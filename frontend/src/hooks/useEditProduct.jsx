import { useState } from "react";
import { editProduct as editProductService } from "../service/productService";

const useEditProduct = () => {
    const [isLoading, setIsLoading] = useState(false);

    const editProduct = async (id, formData) => {
        setIsLoading(true);

        try {
            const product = await editProductService(id, formData);
            return product;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        editProduct,
    };
};

export default useEditProduct;