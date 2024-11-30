export class BadRequestError extends BaseError {
    constructor(message = 'The request could not be understood by the server due to malformed syntax.', details) {
        super(message);
        this.name = 'BadRequestError';
        this.statusCode = 400;
        this.details = details;
    }
}

export class UnauthorizedError extends BaseError {
    constructor(message = 'You are not authorized to access this resource.', details) {
        super(message);
        this.name = 'UnauthorizedError';
        this.statusCode = 401;
        this.details = details;
    }
}

export class ForbiddenError extends BaseError {
    constructor(message = 'You do not have permission to access this resource.', details) {
        super(message);
        this.name = 'ForbiddenError';
        this.statusCode = 403;
        this.details = details;
    }
}

export class NotFoundError extends BaseError {
    constructor(message = 'The requested resource was not found.', details) {
        super(message);
        this.name = 'NotFoundError';
        this.statusCode = 404;
        this.details = details;
    }
}


export class InternalServerError extends BaseError {
    constructor(message = 'An internal server error occurred.', details) {
        super(message);
        this.name = 'InternalServerError';
        this.statusCode = 500;
        this.details = details;
    }
}

class BaseError extends Error {
    constructor(message = 'An error occurred', details) {
        super(message);
        this.name = this.constructor.name;
        this.details = details;
    }
}