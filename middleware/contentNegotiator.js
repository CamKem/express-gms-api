import {NotAcceptableError, UnsupportedMediaTypeError} from "../utils/errors.js";

/**
 *  Check the content-type and accept headers of the request
 *  Parse the request body if it is valid JSON
 *  @param {Request} req - The request object
 *  @param {Response} res - The response object
 *  @param {NextFunction} next - The next function
 */
const contentNegotiator = (req, res, next) => {
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        if (!req.headers['content-type'] || !req.headers['content-type'].startsWith('application/json')) {
            throw new UnsupportedMediaTypeError('Content-Type must be application/json')
                .withDetails(`Received Content-Type: ${req.headers['content-type']}`);
        }
    }

    if (!req.accepts('application/json')) {
        throw new NotAcceptableError('Accept header must allow application/json')
            .withDetails(`Received Accept header: ${req.get('Accept')}`)
            .withCode('ACCEPT_HEADER_INVALID')
    }

    next();
};

export default contentNegotiator;