import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import apiRouter from './routes/apiRouter.js';
import homeRouter from './routes/homeRouter.js';
import fallbackRouter from './routes/fallbackRouter.js';
import errorHandler from './middleware/errorHandler.js';
import {setValue} from "./utils/setValue.js";
import setUniqueRequestId from "./middleware/setUniqueRequestId.js";
import rateLimiter from "./middleware/rateLimiter.js";
import logger from "./utils/logger.js";
import setupExpressJSDocSwagger from "../docs/swagger.js";
import path from "node:path";

// Load environment variables
dotenv.config();

logger('Starting server...');

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
    allowedHeaders: "Content-Type,Authorization,Accept",
    optionsSuccessStatus: 200
}));
// Serve static files from the public directory, such as images, CSS, and JavaScript
// This allows the HTML content to reference these files
// The reference url should be like this: /public/yourfile.png
app.use(express.static(path.join(process.cwd(), 'public')));

// Mongoose Connection Error Handler
mongoose.connection.on("error", (err) => {
    logger('DB Connection Error', 'error', err);
});

// DB Connection & Server Start
mongoose.connect(process.env.DB_CONNECTION_STRING)
    .then(() => {
        // Setup Swagger UI
        setupExpressJSDocSwagger(app);

        //Routers
        app.use('/', homeRouter);
        app.use('/api', apiRouter);
        app.use(fallbackRouter);

        // Global Exception/Error Handler
        app.use(errorHandler);
    })
    .catch(err => {
        if (err) {
            logger('DB Error Occurred', 'error', err);
            process.exit(1);
        }
    })
    .finally(() => {
        app.listen(port, () => {
            logger(`Server running at ${host}:${port}`);
        }).on('error', (err) => {
            logger('Server Error', 'error', err);
        });
    });