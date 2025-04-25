import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AvailableUserRoles, UserRolesEnum } from "../constants.js"

const apiKeySchema = new mongoose.Schema({
    key: { type: String, required: true },
    name: { type: String, required: true },
    permissions: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
    lastUsed: { type: Date }
});

const editorSettingsSchema = new mongoose.Schema({
    theme: { type: String, default: 'light' },
    fontSize: { type: Number, default: 14 },
    tabSize: { type: Number, default: 2 },
    lineWrap: { type: Boolean, default: true },
    keyBindings: { type: String, default: 'standard' }
});

const notificationSettingsSchema = new mongoose.Schema({
    email: { type: Boolean, default: true },
    inApp: { type: Boolean, default: true }
});

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
    },
    role: {
        type: String,
        enum: AvailableUserRoles,
        default: UserRolesEnum.USER,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        select: false,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    lastActive: { 
        type: Date, 
        default: Date.now 
      },
    refreshToken: {
        type: String,

    },
    settings: {
        editor: editorSettingsSchema,
        notifications: notificationSettingsSchema
    },
    apiKeys: [apiKeySchema]
}, {
    timestamps: true,
})

userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};
userSchema.methods.updateActivity = function() {
    this.lastActive = new Date();
    return this.save();
  };

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        role: this.role,
    },
        process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    })
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
};

userSchema.methods.createApiKey = async function(name, permissions = []) {
    const apiKeyValue = crypto.randomBytes(32).toString('hex');
    
    const hashedKey = await bcrypt.hash(apiKeyValue, 10);
    
    this.apiKeys.push({
      key: hashedKey,
      name,
      permissions,
      createdAt: new Date(),
      lastUsed: null
    });
    
    await this.save();
    return apiKeyValue; 
  };

userSchema.methods.generateTemporaryToken = function () {
    const unHashedToken = crypto.randomBytes(20).toString("hex");

    const hashedToken = crypto.createHash("sha256")
        .update(unHashedToken)
        .digest("hex");

    const tokenExpiry = Date.now() + USER_TEMPORARY_TOKEN_EXPIRY;

    return {
        unHashedToken,
        hashedToken,
        tokenExpiry,
    };
};

export const User = mongoose.model("User", userSchema);
