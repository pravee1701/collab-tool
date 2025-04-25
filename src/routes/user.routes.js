import express from "express";
import { changePassword, createApiKey, deleteApiKey, getProfile, listApiKeys, login, register, updateSettings } from "../controllers/user.controller.js"
import { authMiddleware } from "../middleware/auth.middleware.js";
import { changeCurrentPasswordValidator, loginValidator, registerValidator } from "../validators/user.validators.js";
import { validate } from "../utils/validate.js";

const router = express.Router();

// Public routes
router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);

// Protected routes - require authentication
router.use(authMiddleware);
router.get('/profile', getProfile);
router.put('/settings', updateSettings);
router.post('/api-keys', createApiKey);
router.get('/api-keys', listApiKeys);
router.delete('/api-keys/:keyId', deleteApiKey);
router.post('/change-password',changeCurrentPasswordValidator, validate, changePassword);

export default router