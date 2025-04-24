import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import requestIp from "request-ip";
import rateLimit from "express-rate-limit";
import { ApiError } from "./utils/ApiError.js";
import { errorHandler } from "./middleware/error.middleware.js";


dotenv.config();

const app = express();

app.use(requestIp.mw());

const createLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req, res) => {
        return req.clientIp;
    },
    handler: (_, __, ___, options) => {
        throw new ApiError(options.statusCode || 500, "There are too many request")
    }
})

app.use(createLimiter);
app.use(express.json());
app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}));

app.use(cors({
    origin: process.env.CORS_ORIGIN_URI,
    credentials: true
}));

app.use(cookieParser);

app.use(errorHandler);

export default app;