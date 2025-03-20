import axios from "axios";
// Import the store this way to avoid composition API issues in interceptors
import { storeToRefs } from 'pinia';
import { useProjectStore } from "@/stores/project";

// Determine baseURL dynamically
const getBaseURL = () => {
    if (window.location.hostname === "aitrainer.bitz-itc.com") {
        return "https://edms-enpoints.bitz-itc.com/api"; // Production API
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

        const response = await axios.post(`${getBaseURL()}/auth/refresh-token/`, {
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
        alert("Session expired. Please log in again.");
        return Promise.reject(error);
    }
};

// Request Interceptor: Attach Authorization Token and Project ID
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

        // Add Project ID to headers for authenticated requests
        // List of endpoints that should NOT have Project ID headers
        const projectExemptEndpoints = [
            "/register/", 
            "/projects/", 
        ];
        
        // Check if the request URL contains any exempted endpoints
        const isProjectExempt = projectExemptEndpoints.some(endpoint => config.url.includes(endpoint));

        // Only add project ID for authenticated and non-exempt requests
        if (!isPublicEndpoint && !isProjectExempt) {
            // Get project ID from localStorage directly rather than using the store
            // This avoids composition API context issues in interceptors
            const currentProjectId = localStorage.getItem("currentProjectId");
            
            if (currentProjectId) {
                // Add the project ID header - make sure the header name matches what your backend expects
                config.headers["X-Project-ID"] = currentProjectId;
                
                // Log to debug (remove in production)
                console.log(`Added project ID ${currentProjectId} to request: ${config.url}`);
            } else {
                console.warn(`No project selected for request: ${config.url}`);
                // You could add automatic redirection logic here if needed
            }
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