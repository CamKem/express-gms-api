import { InternalServerError } from '../utils/errors/errors.js';
import ResponsableError from '../utils/errors/responsableError.js';
import {setValue} from "../utils/setValue.js";
import logger from "../utils/logger.js";
import ErrorResponse from "../utils/responses/errorResponse.js";

/**
 * Error handler middleware
 *
 * @param err
 * @param req
 * @param res
 * @param next
 * @returns {ErrorResponse} - Error response - {status: 'error', code: 'INTERNAL_SERVER_ERROR', data: {message: 'An error occurred while processing your request', details: '', timestamp: '2024-12-06T03:33:16.299Z'}, path: '/api/v2/products/', method: 'POST', requestId: '9fee4c70-3d4e-5947-9066-7b374b50ceee', docs: '/docs/api/v2/products#add-a-new-product'}
 */
export default function errorHandler(err, req, res, next) {
    if (!(err instanceof Error)) err = new Error(err);

    if (!(err instanceof ResponsableError)) {
        logger(err.message, 'error', err.stack);
        err = new InternalServerError();
    }

    return new ErrorResponse(req)
        .withStatusCode(setValue(err.statusCode, 500))
        .withCode(setValue(err.code, 'INTERNAL_SERVER_ERROR'))
        .withRequestId(req.requestId)
        .withDocsUrl(setValue(err.docs_url, `/docs/search/${err.code}`))
        .send({
            message: setValue(err.message, 'An error occurred while processing your request'),
            details: setValue(err.details, ''),
            timestamp: setValue(err.timestamp, new Date().toISOString()),
        });
}