class ResponsableError extends Error {
    constructor(message = 'An error occurred', statusCode = 500, details) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.details = details;
    }

    withDetails(details) {
        this.details = details;
        return this;
    }
}

class BadRequestError extends ResponsableError {
    constructor(message = 'The request could not be understood by the server due to malformed syntax.', details) {
        super(message, 400, details);
        this.name = 'Bad Request';
    }
}

class UnauthorizedError extends ResponsableError {
    constructor(message = 'You are not authorized to access this resource.', details) {
        super(message, 401, details);
        this.name = 'Unauthorized';
    }
}

class ForbiddenError extends ResponsableError {
    constructor(message = 'You do not have permission to access this resource.', details) {
        super(message, 403, details);
        this.name = 'Forbidden';
    }
}

class NotFoundError extends ResponsableError {
    constructor(message = 'The requested resource was not found.', details) {
        super(message, 404, details);
        this.name = 'Not Found';
    }
}

class MethodNotAllowedError extends ResponsableError {
    constructor(message = 'The method is not allowed for the requested URL.', details) {
        super(message, 405, details);
        this.name = 'Method Not Allowed';
    }
}

class NotAcceptableError extends ResponsableError {
    constructor(message = 'The server cannot generate a response that the client will accept.', details) {
        super(message, 406, details);
        this.name = 'Not Acceptable';
    }
}

class ConflictError extends ResponsableError {
    constructor(message = 'The request could not be completed due to a conflict with the current state of the resource.', details) {
        super(message, 409, details);
        this.name = 'Conflict';
    }
}

class UnsupportedMediaTypeError extends ResponsableError {
    constructor(message = 'The server does not support the media type transmitted in the request.', details) {
        super(message, 415, details);
        this.name = 'Unsupported Media Type';
    }
}


class InternalServerError extends ResponsableError {
    constructor(message = 'An internal server error occurred.', details) {
        super(message, 500, details);
        this.name = 'Internal Server Error';
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
    UnsupportedMediaTypeError
};