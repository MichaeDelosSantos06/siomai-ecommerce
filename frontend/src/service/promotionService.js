import authApi from "../api/authApi";

export const getBanner = async () => {
    const response = await authApi.get('/promotion/get-banner');
    return response.data;
}