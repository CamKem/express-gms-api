import { InternalServerError, ResponsableError } from '../utils/errors.js';
import {setValue} from "../utils/setValue.js";

export default function errorHandler(err, req, res, next) {
    if (!(err instanceof Error)) {
        console.log('Error is not an instance of Error');
        err = new Error(err);
    }

    // Log the error for internal use
    console.error(err.stack);

    // If the error is not a ResponsableError & not dev env, return Internal Server Error
    if (!(err instanceof ResponsableError) && process.env.NODE_ENV !== 'development') {
        err = new InternalServerError();
    }

    // Prepare the error response
    const errorResponse = {
        statusCode: setValue(err.statusCode, 500),
        error: setValue(err.error, 'Internal Server Error'),
        message: setValue(err.message, 'An error occurred while processing your request'),
        path: setValue(err.path, req.originalUrl),
        timestamp: setValue(err.timestamp, new Date().toISOString()),
    };

    // Include additional details if provided
    if (err.details) {
        errorResponse.details = err.details;
    }

    // if its dev env, include the stack trace
    if (process.env.APP_ENV === 'development') {
        errorResponse.stack = err.stack;
    }

    res.status(errorResponse.statusCode).json(errorResponse);
}