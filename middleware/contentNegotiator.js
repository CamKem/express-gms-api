import {NotAcceptableError, UnsupportedMediaTypeError} from "../utils/errors.js";

/**
 *  Check the content-type and accept headers of the request
 *  Parse the request body if it is valid JSON
 *  @param {Request} req - The request object
 *  @param {Response} res - The response object
 *  @param {NextFunction} next - The next function
 *  @returns {NextFunction} - The next function
 *  @throws {UnsupportedMediaTypeError} - If the content-type is not application/json
 *  @throws {NotAcceptableError} - If accept header does not allow application/json
 */
const contentNegotiator = (req, res, next) => {
    if (!req.accepts('application/json')) {
        throw new NotAcceptableError('Accept header must allow application/json')
            .withDetails(`Received Accept header: ${req.get('Accept')}`)
            .withDocsUrl('https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept')
            .withCode('INVALID_ACCEPT_HEADER');
    }

    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        if (!req.get('Content-Type') || !req.is('application/json')) {
            throw new UnsupportedMediaTypeError('Content-Type must be application/json')
                .withDetails(`Received Content-Type: ${req.get('Content-Type')}`)
                .withDocsUrl('https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type')
        }
    }
    return next();
};

export default contentNegotiator;