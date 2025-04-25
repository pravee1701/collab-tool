import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User } from "../models/user.model";


export const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({
      validateBeforeSave: false,
    });

    return {
      accessToken,
      refreshToken,
    }
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating the access token"
    );
  }
};


// register
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(409).json({
        message: 'Username or email already in use'
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      settings: {
        editor: {
          theme: 'light',
          fontSize: 14,
          tabSize: 2,
          lineWrap: true,
          keyBindings: 'standard'
        },
        notifications: {
          email: true,
          inApp: true
        }
      }
    });

    await user.save();


    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating user',
      error: error.message
    });
  }
};

// User login
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username or email
    const user = await User.findOne({
      $or: [
        { username },
        { email: username } // Allow login with email too
      ]
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Validate password
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last active
    user.lastActive = new Date();
    await user.save();

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
    }

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            d: user._id,
            username: user.username,
            email: user.email,
            isVerified: user.isVerified
          },
          'Login successful'
        )
      );
  } catch (error) {
    res.status(500).json({
      message: 'Login error',
      error: error.message
    });
  }
};

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user?._id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching profile',
      error: error.message
    });
  }
};

// Update settings
export const updateSettings = async (req, res) => {
  try {
    const { settings } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update settings using deep merge
    if (settings.editor) {
      user.settings.editor = {
        ...user.settings.editor,
        ...settings.editor
      };
    }

    if (settings.notifications) {
      user.settings.notifications = {
        ...user.settings.notifications,
        ...settings.notifications
      };
    }

    await user.save();

    res.status(200).json({
      message: 'Settings updated successfully',
      settings: user.settings
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating settings',
      error: error.message
    });
  }
};

// Generate API key
export const createApiKey = async (req, res) => {
  try {
    const { name, permissions } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!name) {
      return res.status(400).json({ message: 'API key name is required' });
    }

    // Generate a random API key
    const apiKey = await user.createApiKey(name, permissions);

    res.status(201).json({
      message: 'API key created successfully',
      apiKey, // Only time the unencrypted key is returned
      name,
      permissions
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating API key',
      error: error.message
    });
  }
};

// List API keys (without the key values)
export const listApiKeys = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return API keys without the actual key values
    const apiKeys = user.apiKeys.map(key => ({
      id: key._id,
      name: key.name,
      permissions: key.permissions,
      createdAt: key.createdAt,
      lastUsed: key.lastUsed
    }));

    res.status(200).json({ apiKeys });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching API keys',
      error: error.message
    });
  }
};

// Delete API key
export const deleteApiKey = async (req, res) => {
  try {
    const { keyId } = req.params;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find and remove the API key
    const keyIndex = user.apiKeys.findIndex(
      key => key._id.toString() === keyId
    );

    if (keyIndex === -1) {
      return res.status(404).json({ message: 'API key not found' });
    }

    user.apiKeys.splice(keyIndex, 1);
    await user.save();

    res.status(200).json({ message: 'API key deleted successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting API key',
      error: error.message
    });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isValid = await user.validatePassword(currentPassword);
    if (!isValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword; // Will be hashed by pre-save hook
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating password',
      error: error.message
    });
  }
};