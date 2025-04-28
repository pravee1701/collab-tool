import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"


export const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(
      401,
      "Unauthorized request"
    )
  }

  try {
    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken "
    )

    if (!user) {
      throw new ApiError(
        401,
        "Invalid access token"
      );
    }
    if (!user.isEmailVerified && req.path !== '/verify-email') {
      return next(new ApiError(401, 'Please verify your email first'));
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(
      401,
      error?.message || "Invalid access token"
    );
  }
});

export const authorize = (roles = []) =>
  asyncHandler(async (req, res, next) => {
    if (!req.user?._id) {
      throw new ApiError(401, "Unauthorized request");
    }

    if (roles.includes(req.user?.role)) {
      next();
    } else {
      throw new ApiError(403, "You are not allowed to perform this action");
    }
  });


export const validateApiKey = asyncHandler( async (req, res, next ) => {
  const apiKey = req.headers['x-api-key'];
    
    if (!apiKey) {
      return next(new ApiError('API key is required', 401));
    }

    const user = await User.findOne({ 'apiKeys.key': apiKey });
    
    if (!user) {
      return next(new ApiError('Invalid API key', 401));
    }

    const key = user.apiKeys.find(k => k.key === apiKey);
    
    key.lastUsed = Date.now();
    await user.save();

    req.user = user;
    req.apiKey = key;
    next();
})