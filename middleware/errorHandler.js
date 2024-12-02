import { InternalServerError, ResponsableError } from '../utils/errors.js';
import {setValue} from "../utils/setValue.js";
import logger from "../utils/logger.js";
import {ErrorResponse} from "../utils/responses.js";

/**
 * Error handler middleware
 * @param err
 * @param req
 * @param res
 * @param next
 * @returns {ErrorResponse}
 */
export default function errorHandler(err, req, res, next) {
    if (!(err instanceof Error)) err = new Error(err);

    // If the error is not a ResponsableError, return Internal Server Error
    if (!(err instanceof ResponsableError)) {
        logger(err.message, 'error', err.stack);
        err = new InternalServerError();
    }

    // Send the error response
    return new ErrorResponse(req)
        .withStatusCode(setValue(err.statusCode, 500))
        .withCode(setValue(err.code, 'INTERNAL_SERVER_ERROR'))
        .withRequestId(req.requestId)
        .withDocsUrl(setValue(err.documentation_url, `${process.env.APP_URL}/docs/errors#${err.code}`))
        .send({
            message: setValue(err.message, 'An error occurred while processing your request'),
            details: setValue(err.details, ''),
            timestamp: setValue(err.timestamp, new Date().toISOString()),
            path: setValue(err.path, req.originalUrl)
        });
}