import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import apiRouter from './routes/apiRouter.js';
import rootRouter from './routes/rootRouter.js';
import fallbackRouter from './routes/fallbackRouter.js';
import errorHandler from './middleware/errorHandler.js';
import {setValue} from "./utils/setValue.js";
import setUniqueRequestId from "./middleware/setUniqueRequestId.js";
import rateLimiter from "./middleware/rateLimiter.js";
import logger from "./utils/logger.js";

// Load environment variables
dotenv.config();

// App Setup
const app = express();
const port = setValue(process.env.APP_PORT, 3000);
const host = setValue(process.env.APP_HOST, 'http://localhost');

// Middleware
app.use(rateLimiter);
app.use(setUniqueRequestId);
app.use(cors({
    origin: "*",
    methods: "GET,HEAD,POST,PUT,PATCH,DELETE",
    optionsSuccessStatus: 200
}));

// Mongoose Connection Error Handler
mongoose.connection.on("error", (err) => {
    throw new Error("DB error: " + err);
});

// DB Connection & Server Start
mongoose.connect(process.env.DB_CONNECTION_STRING)
    .then(() => {
        //Routers
        app.use('/', rootRouter);
        app.use('/api', apiRouter);
        app.use(fallbackRouter);

        // Global Exception/Error Handler
        app.use(errorHandler);

        console.log('API Routes loaded', apiRouter.stack);
    })
    .catch(err => {
        if (err) {
            logger('DB Error Occurred', 'error', err);
            process.exit(1);
        }
    })
    .finally(() => {
        const isMainFile = process.argv.filter(arg => arg.includes('index.js')).length > 0;
        if (isMainFile) {
            app.listen(port, () => {
                console.info(`Server running on ${host}:${port}`);
            });
        }
    });