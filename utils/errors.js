/**
 * Custom error classes that can be used to return error responses
 */
class ResponsableError extends Error {
    constructor(message = 'An error occurred', statusCode = 500, details) {
        super(message);
        this.code = this.constructor.name;
        this.statusCode = statusCode;
        this.timestamp = new Date().toISOString();
        this.path = undefined;
        this.details = details;
        this.documentation_url = undefined;
    }

    /**
     * Set the code of the error so that it can be referenced
     * E.g. 'USER_NOT_FOUND' for a resource where a user was not found
     * @param code
     * @returns {ResponsableError}
     */
    withCode(code) {
        this.code = code;
        return this;
    }

    /**
     * Set the timestamp of the error
     * @param timestamp
     * @returns {ResponsableError}
     */
    withTimestamp(timestamp) {
        this.timestamp = timestamp;
        return this;
    }

    /**
     * Set the path of the request that caused the error
     * @param path
     * @returns {ResponsableError}
     */
    withPath(path) {
        this.path = path;
        return this;
    }

    /**
     * Set the details to provide more information about the error
     * @param details
     * @returns {ResponsableError}
     */
    withDetails(details) {
        this.details = details;
        return this;
    }

    /**
     * Set the documentation URL to provide more information about the error
     * @param documentation_url
     * @returns {ResponsableError}
     */
    withDocumentationUrl(documentation_url) {
        this.documentation_url = documentation_url;
        return this;
    }

}

class BadRequestError extends ResponsableError {
    constructor(message = 'The request could not be understood by the server due to malformed syntax.', details) {
        super(message, 400, details);
        this.code = 'BAD_REQUEST';
    }
}

class UnauthorizedError extends ResponsableError {
    constructor(message = 'You are not authorized to access this resource.', details) {
        super(message, 401, details);
        this.code = 'UNAUTHORIZED';
    }
}

class ForbiddenError extends ResponsableError {
    constructor(message = 'You do not have permission to access this resource.', details) {
        super(message, 403, details);
        this.code = 'FORBIDDEN';
    }
}

class NotFoundError extends ResponsableError {
    constructor(message = 'The requested resource was not found.', details) {
        super(message, 404, details);
        this.code = 'NOT_FOUND';
    }
}

class MethodNotAllowedError extends ResponsableError {
    constructor(message = 'The method is not allowed for the requested URL.', details) {
        super(message, 405, details);
        this.code = 'METHOD_NOT_ALLOWED';
    }
}

class NotAcceptableError extends ResponsableError {
    constructor(message = 'The server cannot generate a response that the client will accept.', details) {
        super(message, 406, details);
        this.code = 'NOT_ACCEPTABLE';
    }
}

class ConflictError extends ResponsableError {
    constructor(message = 'The request could not be completed due to a conflict with the current state of the resource.', details) {
        super(message, 409, details);
        this.code = 'CONFLICT';
    }
}

class UnsupportedMediaTypeError extends ResponsableError {
    constructor(message = 'The server does not support the media type transmitted in the request.', details) {
        super(message, 415, details);
        this.code = 'UNSUPPORTED_MEDIA_TYPE';
    }
}

class UnprocessableEntityError extends ResponsableError {
    constructor(message = 'The server cannot process the request due to semantic errors.', details) {
        super(message, 422, details);
        this.code = 'UNPROCESSABLE_ENTITY';
    }
}


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
    ResponsableError,
    NotAcceptableError,
    ConflictError,
    MethodNotAllowedError,
    UnsupportedMediaTypeError,
    UnprocessableEntityError
};