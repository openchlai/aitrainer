import axios from "axios";

// Determine baseURL dynamically
const getBaseURL = () => {
    if (window.location.hostname === "aitrainer.bitz-itc.com") {
        return "https://edms-enpoints.bitz-itc.com/";
    }
    return "http://127.0.0.1:8000/api"; // Default local API
};

// Create an Axios instance
const apiClient = axios.create({
    baseURL: getBaseURL(), // Set dynamic base URL
    headers: {
        "Content-Type": "application/json",
    },
});

// Flag to track refreshing state
let isRefreshing = false;
let refreshSubscribers = [];

// Function to subscribe requests waiting for a new token
const subscribeTokenRefresh = (cb) => {
    refreshSubscribers.push(cb);
};

// Function to notify all subscribers with the new token
const onRefreshed = (token) => {
    refreshSubscribers.forEach((cb) => cb(token));
    refreshSubscribers = [];
};

// Function to refresh token
const refreshToken = async () => {
    try {
        const refresh_token = localStorage.getItem("refresh_token");
        if (!refresh_token) {
            throw new Error("No refresh token found.");
        }

        const response = await axios.post(`${getBaseURL()}token/refresh/`, {
            refresh: refresh_token,
        });

        const newAccessToken = response.data.access;
        localStorage.setItem("access_token", newAccessToken);

        onRefreshed(newAccessToken);
        return newAccessToken;
    } catch (error) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(error);
    }
};

// Request Interceptor: Attach Authorization Token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");

        // List of endpoints that should NOT have Authorization headers
        const publicEndpoints = ["/verify-otp", "/register", "/request-otp"];

        // Check if the request URL contains any of the public endpoints
        const isPublicEndpoint = publicEndpoints.some(endpoint => config.url.includes(endpoint));

        if (token && !isPublicEndpoint) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle Token Expiry & Refresh
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve) => {
                    subscribeTokenRefresh((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(apiClient(originalRequest));
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const newToken = await refreshToken();
                isRefreshing = false;
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return apiClient(originalRequest);
            } catch (err) {
                isRefreshing = false;
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
