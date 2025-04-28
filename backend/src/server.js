import http from "http";
import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import logger from "./logger/winston.logger.js";

dotenv.config();

const server = http.createServer(app);

connectDB();


const PORT = process.env.PORT || 8080;


server.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
})