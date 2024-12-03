/**
 * Base Response class for handling API responses
 * @constructor
 * @param request
 * @param type
 * @returns Response object
 */
class BaseResponse {

    constructor(request, type) {
        this.request = request;
        this.type = type;
        this.status_code = 200;
        this.response_code = 'OK';
        this.request_id = request.requestId;
        this.docs_url = `${process.env.APP_HOST}/docs/search/${this.response_code}`;
    }

    withCode(code) {
        this.response_code = code;
        return this;
    }

    withStatusCode(statusCode) {
        this.status_code = statusCode;
        return this;
    }

    withRequestId(requestId) {
        this.request_id = requestId;
        return this;
    }

    withDocsUrl(docs_url) {
        this.docs_url = docs_url;
        return this;
    }

    withLocation(location) {
        this.request.res.location(location);
        return this;
    }

    withHeaders(array) {
        array.forEach(([key, value]) => {
            this.request.res.setHeader(key, value);
        });
        return this;
    }

    send(data) {
        return this.request.res.status(this.status_code)
            .json({
                status: this.type,
                code: this.response_code,
                data: data,
                path: this.request.baseUrl + this.request.path,
                method: this.request.method,
                requestId: this.request_id,
                docs: this.docs_url
            });
    }
}

/**
 * API response class for handling API success responses
 * @extends BaseResponse
 * @constructor
 * @param request
 * @returns Response object
 */
class APIResponse extends BaseResponse {
    constructor(request) {
        super(request, 'success');
    }
}

/**
 * Error response class for handling API error responses
 * @extends APIResponse
 * @constructor
 * @param request
 * @returns Response object
 */
class ErrorResponse extends BaseResponse {
    constructor(request) {
        super(request, 'error');
    }
}

/**
 * Response class for handling non-API responses
 *
 * @constructor
 * @param request
 * @returns Response object
 */

// Uncaught ReferenceError: Cannot access 'Response' before initialization/
    // To fix this, we need to rename the Response class in the responses.js file to something else.

class Response {
    constructor(request) {
        this.request = request;
        this.status_code = 200;
        this.type = 'text/html';
    }

    asType(type) {
        this.type = type;
        return this;
    }

    send(view) {
        return this.request.res
            .status(this.status_code)
            .type(this.type)
            .send(view);
    }
}

export { APIResponse, ErrorResponse, Response };