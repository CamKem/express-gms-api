class ResponsableError extends Error {
    constructor(message = 'An error occurred', statusCode = 500, details) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.details = details;
    }
}

class BadRequestError extends ResponsableError {
    constructor(message = 'The request could not be understood by the server due to malformed syntax.', details) {
        super(message, 400, details);
    }
}

class UnauthorizedError extends ResponsableError {
    constructor(message = 'You are not authorized to access this resource.', details) {
        super(message, 401, details);
    }
}

class ForbiddenError extends ResponsableError {
    constructor(message = 'You do not have permission to access this resource.', details) {
        super(message, 403, details);
    }
}

class NotFoundError extends ResponsableError {
    constructor(message = 'The requested resource was not found.', details) {
        super(message, 404, details);
    }
}


class InternalServerError extends ResponsableError {
    constructor(message = 'An internal server error occurred.', details) {
        super(message, 500, details);
    }
}

export {
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    InternalServerError,
    ResponsableError
};