import authApi from "../api/authApi";

export const displayHotPicks = async () => {
    const response = await authApi.get("/product/trending");
    return response.data;
}

export const addToCart = async (id) => {
    const response = await authApi.post("/product/add-to-cart", {id});
    return response.data;
}

export const displayProduct = async () => {
    const response = await authApi.get("/api/admin/get-data");
    return response.data;
}

export const addProduct = async (formData) => {
    const response = await authApi.post('/api/product/addProduct', formData);
    return response.data;
}

export const editProduct = async (id, formData) => {
    const response = await authApi.put(`/api/admin/edit-product/${id}`, formData)
    return response.data;
}

export const deleteItem = async (id) => {
    const response = await authApi.put(`/api/admin/delete-product/${id}`);
    return response.data;
}

export const updateAvailability = async (id) => {
    const response = await authApi.put(`/api/product/change-availability/${id}`);
    return response.data;
}

export const displayMenuList = async () => {
    const response = await authApi.get('/api/product/product-list');
    return response.data;
}
