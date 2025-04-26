import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';
import logger from '../logger/winston.logger.js';

const connectDB = async () => {
    try {
        const conn  = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

        logger.info(`MongoDB connected: ${conn.connection.host}`);

    } catch (error) {
        logger.error("MongoDB connection error: ", error);
        process.exit(1);
    }
};

export default connectDB;