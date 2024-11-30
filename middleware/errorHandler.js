export default function errorHandler(err, req, res, next) {
    if (!err instanceof Error) {
        err = new Error(err);
    }

    // Log the error for internal use
    console.error(err.stack);

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

    // if it's a Error object, and not a custom error we have defined, we only want to resturn a response
    // if we are in development mode, otherwise we will return a custom error BadRequest or InternalServerError
    // the most appropriate error for the situation, being a generlized error message would to use InternalServerError
    if (err instanceof Error && !err.statusCode) {
        errorResponse.statusCode = process.env.NODE_ENV === 'development' ? 500 : 400;
        errorResponse.error = getErrorName(errorResponse.statusCode);
        errorResponse.message = process.env.NODE_ENV === 'development' ? err.message : 'An internal server error occurred.';
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