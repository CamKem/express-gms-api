import { InternalServerError, ResponsableError } from '../utils/errors.js';

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

    const errorResponse = {
        statusCode: err.statusCode || 500,
        error: getErrorName(err.statusCode),
        message: err.message || 'Internal Server Error',
        path: req.originalUrl,
        timestamp: new Date().toISOString(),
    };

    // Include additional details if provided
    if (err.details) {
        errorResponse.details = err.details;
    }

    res.status(errorResponse.statusCode).json(errorResponse);
}

// Get error names based on status codes
function getErrorName(statusCode) {
    const errorNames = {
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not Found',
        500: 'Internal Server Error',
    };
    return errorNames[statusCode] || 'Error';
}