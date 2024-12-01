import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import { apiRouter } from './routes/apiRouter.js';
import rootRouter from './routes/rootRouter.js';
import fallbackRouter from './routes/fallbackRouter.js';
import errorHandler from './middleware/errorHandler.js';
import contentTypeHandler from './middleware/contentTypeHandler.js';
import {setValue} from "./utils/setValue.js";
import setUniqueRequestId from "./middleware/setUniqueRequestId.js";
import rateLimiter from "./middleware/rateLimiter.js";

// Load environment variables
dotenv.config();

// App Setup
const app = express();
const port = setValue(process.env.APP_PORT, 3000);
const host = setValue(process.env.APP_HOST, 'http://localhost');

// Middleware
app.use(rateLimiter);
app.use(setUniqueRequestId);
app.use(contentTypeHandler);
// TODO: work out if we need this:
//  app.use(express.urlencoded({extended: true}));
app.use(cors({
    origin: "*",
    methods: "GET,HEAD,POST,PUT,PATCH,DELETE",
    optionsSuccessStatus: 200
}));

// Routers
app.use('/', rootRouter);
app.use('/api', apiRouter);
app.use(fallbackRouter);

// Global Error/Exception Handler
app.use(errorHandler);

// Mongoose Connection Error Handler
mongoose.connection.on("error", (err) => {
    console.error("DB error: " + err);
});

// DB Connection & Server Start
mongoose.connect(process.env.DB_CONNECTION_STRING)
    .then(() => {
        console.log('Database connected');
        app.listen(port, () => {
            console.log(`Server running on ${host}:${port}`);
        });
    })
    .catch(err => {
        console.error('Database connection error:', err);
        process.exit(1);
    });