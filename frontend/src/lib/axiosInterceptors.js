import { axiosInstance } from "./axiosInstance";
import { store } from "@/store/store";
import { refreshUser, logout } from "@/features/auth/authSlice";

// Flag to track if we're currently refreshing the token
let isRefreshing = false;
// Store of waiting requests
let waitingRequests = [];

// Function to process waiting requests
const processWaitingRequests = (token) => {
  waitingRequests.forEach(({ config, resolve, reject }) => {
    config.headers.Authorization = `Bearer ${token}`;
    axiosInstance(config).then(resolve).catch(reject);
  });
  waitingRequests = [];
};

export const setupAxiosInterceptors = () => {
  // Request interceptor
  axiosInstance.interceptors.request.use(
    (config) => {
      // Don't add token for refresh token requests
      if (config.url === "/user/refresh-token") {
        return config;
      }
      
      const token = store.getState().auth.user?.accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      // Skip retry for refresh token endpoint to avoid loops
      if (originalRequest.url === "/user/refresh-token") {
        return Promise.reject(error);
      }

      if (error?.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        // If we're already refreshing, queue this request
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            waitingRequests.push({ config: originalRequest, resolve, reject });
          });
        }
        
        isRefreshing = true;
        
        try {
          await store.dispatch(refreshUser()).unwrap();
          const token = store.getState().auth.user?.accessToken;
          
          // Process any queued requests
          processWaitingRequests(token);
          
          // Retry the original request
          isRefreshing = false;
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          waitingRequests = []; // Clear any waiting requests
          await store.dispatch(logout());
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};