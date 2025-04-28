import { axiosInstance } from "@/lib/axiosInstance";

// Register new user
const register = async (userData) => {
  try {
    const response = await axiosInstance.post("/user/register", userData);
    return response.data;
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;
  }
};

// Login user
const login = async (userData) => {
  try {
    const response = await axiosInstance.post("/user/login", userData);
    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

// Logout user
const logout = () => {
  return axiosInstance.post("/user/logout");
};

// Refresh access token
const refreshToken = async () => {
  try {
    const response = await axiosInstance.post("/user/refresh-token");
    return response.data.data;
  } catch (error) {
    console.error("Error during token refresh:", error);
    throw error;
  }
};

// Get current logged in user
const getCurrentUser = async () => {
  try {
    const response = await axiosInstance.get("/user/current-user");
    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
};

// Handle API keys
const getApiKeys = async () => {
  try {
    const response = await axiosInstance.get("/user/api-keys");    
    return response.data.data.apiKeys;
  } catch (error) {
    console.error("Error fetching API keys:", error);
    throw error;
  }
};


const createApiKey = async (keyData) => {
  try {
    const response = await axiosInstance.post("/user/api-keys", keyData);
    return response.data;
  } catch (error) {
    console.error("Error creating API key:", error);
    throw error;
  }
};

const deleteApiKey = async (id) => {
  try {
    const response = await axiosInstance.delete(`/user/api-keys/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting API key:", error);
    throw error;
  }
};
const changePassword = async (passwordData) => {
  const response = await axiosInstance.post("/user/change-password", passwordData);
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  refreshToken,
  getCurrentUser,
  getApiKeys,  
  createApiKey, 
  deleteApiKey,
};

export default authService;
