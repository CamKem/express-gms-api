import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import apiRouter from './routes/apiRouter.js';
import rootRouter from './routes/rootRouter.js';
import errorHandler from './middleware/errorHandler.js';
import { NotFoundError } from './utils/errors.js';
import responseHelpers from "./utils/responseHelpers.js";

// Load environment variables
dotenv.config();

// App Setup
const app = express();
const port = process.env.APP_PORT || 3000;
const host = process.env.APP_HOST || 'http://localhost';

// Middleware
app.use(express.json());
app.use(responseHelpers);
app.use(cors({
    origin: "*",
    methods: "GET,HEAD,POST,PUT,PATCH,DELETE",
    optionsSuccessStatus: 200
}));

// Routers
app.use('/', rootRouter);
app.use('/api', apiRouter);

// 404 Handler for Undefined Routes
app.use((req, res, next) => {
    next(new NotFoundError);
});
// Global Error Handler
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