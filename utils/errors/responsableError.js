/**
 * @description This does not need to be documented in the OpenAPI spec,
 * As it is an interal base class for other error classes.
 */
class ResponsableError extends Error {
    constructor(message = 'An error occurred', statusCode = 500, details) {
        super(message);
        this.code = this.constructor.name;
        this.statusCode = statusCode;
        this.timestamp = new Date().toISOString();
        this.details = details;
        this.docs_url = undefined;
    }

    /**
     * Set the code of the error so that it can be referenced
     *
     * @example 'USER_NOT_FOUND' for a resource where a user was not found
     * @param code
     * @returns {ResponsableError}
     */
    withCode(code) {
        this.code = code;
        return this;
    }

    /**
     * Set the details to provide more information about the error
     *
     * @example 'The user with ID 123 was not found'
     * @param details
     * @returns {ResponsableError}
     */
    withDetails(details) {
        this.details = details;
        return this;
    }

    /**
     * Set the docs URL to provide more information about the error.
     *
     * @example 'https://example.com/docs/errors/USER_NOT_FOUND'
     * @param docs_url
     * @returns {ResponsableError}
     */
    withDocsUrl(docs_url) {
        this.docs_url = docs_url;
        return this;
    }

}

export default ResponsableError;