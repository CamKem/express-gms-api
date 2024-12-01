import { InternalServerError, ResponsableError } from '../utils/errors.js';
import {setValue} from "../utils/setValue.js";
import logger from "../utils/logger.js";
import {ErrorResponse} from "../utils/responses.js";

export default function errorHandler(err, req, res, next) {
    if (!(err instanceof Error)) err = new Error(err);

    // If the error is not a ResponsableError, return Internal Server Error
    if (!(err instanceof ResponsableError)) {
        logger(err.message, 'error', err.stack);
        err = new InternalServerError();
    }

    // Send the error response
    new ErrorResponse(req)
        .statusCode(setValue(err.statusCode, 500))
        .code(setValue(err.code, 'INTERNAL_SERVER_ERROR'))
        .requestId(req.requestId)
        .docsUrl(setValue(err.documentation_url, `${process.env.APP_URL}/docs/errors#${err.code}`))
        .send({
            message: setValue(err.message, 'An error occurred while processing your request'),
            details: setValue(err.details, ''),
            timestamp: setValue(err.timestamp, new Date().toISOString()),
            path: setValue(err.path, req.originalUrl)
        });

    next();
}