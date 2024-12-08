import ResponsableError from './responsableError.js';

/**
 * Error class for when the request is malformed.
 *
 * @reason Usually related to the syntax of the request.
 * @status 400
 */
class BadRequestError extends ResponsableError {
    constructor(message = 'The request could not be understood by the server due to malformed syntax.', details) {
        super(message, 400, details);
        this.code = 'BAD_REQUEST';
    }
}

/**
 * Error class for unauthorized access to a resource.
 *
 * @reason Usually related to the authentication of the user making the request.
 * @status 401
 */
class UnauthorizedError extends ResponsableError {
    constructor(message = 'You are not authorized to access this resource.', details) {
        super(message, 401, details);
        this.code = 'UNAUTHORIZED';
    }
}

/**
 * Error class for when a resource is forbidden.
 *
 * @reason Usually related to the permissions of the user making the request.
 * @status 403
 */
class ForbiddenError extends ResponsableError {
    constructor(message = 'You do not have permission to access this resource.', details) {
        super(message, 403, details);
        this.code = 'FORBIDDEN';
    }
}

/**
 * Error class for when a resource is not found.
 *
 * @reason Usually related to the URL used in the request.
 * @status 404
 */
class NotFoundError extends ResponsableError {
    constructor(message = 'The requested resource was not found.', details) {
        super(message, 404, details);
        this.code = 'NOT_FOUND';
    }
}

/**
 * Error class for when a method is not allowed for a resource
 *
 * @reason Usually related to the HTTP method used in the request.
 * @status 405
 */
class MethodNotAllowedError extends ResponsableError {
    constructor(message = 'The method is not allowed for the requested URL.', details) {
        super(message, 405, details);
        this.code = 'METHOD_NOT_ALLOWED';
    }
}

/**
 * Error class for a resource that is not acceptable
 *
 * @reason Usually related to the Accept header in the request.
 * @status 406
 */
class NotAcceptableError extends ResponsableError {
    constructor(message = 'The server cannot generate a response that the client will accept.', details) {
        super(message, 406, details);
        this.code = 'NOT_ACCEPTABLE';
    }
}

/**
 * Error class for when there is a conflict with the current state of the resource
 * @reason Usually due to a resource being modified by another request.
 * @status 409
 */
class ConflictError extends ResponsableError {
    constructor(message = 'The request could not be completed due to a conflict with the current state of the resource.', details) {
        super(message, 409, details);
        this.code = 'CONFLICT';
    }
}

/**
 * Error class for Unsupported Media Type.
 * @reason Usually due to the server not supporting the media type transmitted in the request.
 * @status 415
 */
class UnsupportedMediaTypeError extends ResponsableError {
    constructor(message = 'The server does not support the media type transmitted in the request.', details) {
        super(message, 415, details);
        this.code = 'UNSUPPORTED_MEDIA_TYPE';
    }
}

/**
 * Error class for when a resource cannot be processed.
 *
 * @reason Usually due to semantic errors (e.g. validation errors).
 * @status 422
 */
class UnprocessableEntityError extends ResponsableError {
    constructor(message = 'The server cannot process the request due to semantic errors.', details) {
        super(message, 422, details);
        this.code = 'UNPROCESSABLE_ENTITY';
    }
}

/**
 * Error class for when an internal server error occurs.
 *
 * @reason Usually due to an unexpected condition that prevented it from fulfilling the request.
 * @status 500
 */
class InternalServerError extends ResponsableError {
    constructor(message = 'An internal server error occurred.', details) {
        super(message, 500, details);
        this.code = 'INTERNAL_SERVER_ERROR';
    }
}

export {
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    InternalServerError,
    NotAcceptableError,
    ConflictError,
    MethodNotAllowedError,
    UnsupportedMediaTypeError,
    UnprocessableEntityError
};