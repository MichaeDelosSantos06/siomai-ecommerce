import authApi from "../api/authApi";

export const addToCart = async (productId) => {
    const response = await authApi.post('/api/cart/add-to-cart', {productId});
    return response.data;
}

export const readItems = async () => {
    const response = await authApi.get('/api/cart/get-cart-item');
    return response.data;
}