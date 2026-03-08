import axios from 'axios'

const AxiosService = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Request Interceptor: Attach Auth Token
AxiosService.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token)
        config.headers.Authorization = `Bearer ${token}`

    return config
})

// Senior Security: Centralized Session Expiry Management
// Automatically detects 401/403 errors and bounces unauthorized users to login
AxiosService.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && [401, 403].includes(error.response.status)) {
            // Protect against stale state and unauthorized reuse
            localStorage.clear();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default AxiosService