import axios from "axios";

// Base axios instance with configuration
const authApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    // Timeout after 10 seconds
    timeout: 10000,
});

// Request Interceptor - Automatically adds JWT token to requests
authApi.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        // If token exists, add it to Authorization header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }else {
            delete config.headers.Authorization;
        }
        
        return config;
    },
    (error) => {
        // Log error for debugging
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response Interceptor - Handles common response scenarios
authApi.interceptors.response.use(
    // Success response - pass through
    (response) => response,
    
    // Error response - handle specific error cases
    (error) => {
        // 401 Unauthorized - Token expired or invalid
        if (error.response?.status === 401) {

             if (!error.config?.url?.includes('/login')) {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
            // // Clear authentication data
            // localStorage.removeItem('user');
            // localStorage.removeItem('token');
            
            // // Redirect to login page
            // // Note: We use window.location to ensure full page reload
            // // which clears any in-memory state
            // window.location.href = '/login';
        }
        
        // 403 Forbidden - User doesn't have permission
        if (error.response?.status === 403) {
            console.error('Access forbidden:', error.response.data?.message || 'You do not have permission to access this resource');
        }
        
        // 500 Server Error
        if (error.response?.status === 500) {
            console.error('Server error:', 'An internal server error occurred. Please try again later.');
        }
        
        // Network Error (no response from server)
        if (!error.response) {
            console.error('Network error:', 'Unable to connect to the server. Please check your internet connection.');
        }
        
        return Promise.reject(error);
    }
);

export default authApi;
