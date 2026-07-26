import authApi from "../api/authApi";

export const registerUser = async (userData) => {
    const response = await authApi.post('/user/register', userData);
    return response.data;
}

export const loginUser = async (userData) => {
    const response = await authApi.post('/user/login', userData);
    return response.data;
}

export const googleLogin = async (accessToken) => {
    const response = await authApi.post("/user/googleLogin", {
        accessToken
    });
    return response.data;
}

export const getUserInfo = async () => {
    const response = await authApi.get("/user/get-user-info");
    return response.data;
}

export const getTotalUser = async () => {
    const response = await authApi.get("/user/get-total-user");
    return response.data;
}

export const getTotalUserVip = async () => {
    const response = await authApi.get("/user/get-total-vip");
    return response.data;
}

export const getTotalUserNew = async () => {
    const response = await authApi.get("/user/get-total-new");
    return response.data;
}

