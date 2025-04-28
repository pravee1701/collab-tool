import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";
import { toast } from "react-hot-toast";
import axios from "axios";

// Safe localStorage user retrieval
let user = null;
try {
  const storedUser = localStorage.getItem("user");
  user = storedUser ? JSON.parse(storedUser) : null;
} catch (error) {
  console.error("Error parsing user data from localStorage:", error);
  localStorage.removeItem("user"); // Remove corrupted data
}

const initialState = {
  user: user || null,
  isLoading: false,
  isError: false,
  message: "",
  apiKeys: [], // NEW: apiKeys in state
};

// Async Thunks
export const register = createAsyncThunk("auth/register", async (userData, thunkAPI) => {
  try {
    const data = await authService.register(userData);
    return data.user;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const login = createAsyncThunk("auth/login", async (userData, thunkAPI) => {
  try {
    const data = await authService.login(userData);
    return data?.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    await authService.logout();
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const refreshUser = createAsyncThunk("auth/refresh", async (_, thunkAPI) => {
  try {
    const data = await authService.refreshToken();
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue();
  }
});

// Forgot / Reset Password
export const forgotPassword = createAsyncThunk("auth/forgotPassword", async (email, { rejectWithValue }) => {
  try {
    const response = await axios.post(`/forgot-password`, { email });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const resetPassword = createAsyncThunk("auth/resetPassword", async ({ token, password }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`/reset-password/${token}`, { password });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const changePassword = createAsyncThunk("auth/changePassword", async ({ oldPassword, newPassword }, { rejectWithValue }) => {
  try {
    const response = await axios.post("/change-password", { oldPassword, newPassword });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data.message || "Failed");
  }
});

export const resendVerificationEmail = createAsyncThunk("auth/resendVerificationEmail", async ({ email }, { rejectWithValue }) => {
  try {
    const response = await axios.post("/resend-email-verification", { email });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data.message || "Failed");
  }
});

// API Keys CRUD
export const getApiKeys = createAsyncThunk("auth/getApiKeys", async (_, thunkAPI) => {
  try {
    const response = await authService.getApiKeys();
    return response;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});


export const createApiKey = createAsyncThunk("auth/createApiKey", async (keyData, thunkAPI) => {
  try {
    return await authService.createApiKey(keyData);
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const deleteApiKey = createAsyncThunk("auth/deleteApiKey", async (id, thunkAPI) => {
  try {
    return await authService.deleteApiKey(id);
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuth: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
        toast.success("Registered Successfully!");
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
        toast.success("Logged in Successfully!");
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        localStorage.removeItem("user");
        toast.success("Logged out Successfully!");
      })

      // Refresh Token
      .addCase(refreshUser.fulfilled, (state, action) => {
        if (action.payload?.accessToken) {
          state.user = {
            ...state.user,
            accessToken: action.payload.accessToken,
            refreshToken: action.payload.refreshToken,
          };
          localStorage.setItem("user", JSON.stringify(state.user));
        }
      })
      .addCase(refreshUser.rejected, (state) => {
        state.isError = true;
        state.user = null;
        localStorage.removeItem("user");
      })

      // Forgot / Reset Password
      .addCase(forgotPassword.pending, (state) => { state.isLoading = true; })
      .addCase(forgotPassword.fulfilled, (state) => { state.isLoading = false; })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(resetPassword.pending, (state) => { state.isLoading = true; })
      .addCase(resetPassword.fulfilled, (state) => { state.isLoading = false; })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // API Keys
      .addCase(getApiKeys.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getApiKeys.fulfilled, (state, action) => {
        state.isLoading = false;
        state.apiKeys = action.payload;  
      })
      .addCase(getApiKeys.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(createApiKey.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createApiKey.fulfilled, (state, action) => {
        state.isLoading = false;

      })
      .addCase(createApiKey.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Delete API Key
      .addCase(deleteApiKey.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteApiKey.fulfilled, (state, action) => {
        state.isLoading = false;

      })
      .addCase(deleteApiKey.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetAuth } = authSlice.actions;
export default authSlice.reducer;
