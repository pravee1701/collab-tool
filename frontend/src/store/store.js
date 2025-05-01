import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import projectReducer from '../store/projectSlice';
import fileReducer from '../store/fileSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        projects: projectReducer,
        files: fileReducer,
    },
});

export default store;
