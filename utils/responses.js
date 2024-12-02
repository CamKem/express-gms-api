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
        this.docs_url = `${process.env.APP_HOST}/docs/${this.response_code}`;
    }

    code(code) {
        this.response_code = code;
        return this;
    }

    statusCode(statusCode) {
        this.status_code = statusCode;
        return this;
    }

    requestId(requestId) {
        this.request_id = requestId;
        return this;
    }

    docsUrl(docs_url) {
        this.docs_url = docs_url;
        return this;
    }

    send(data) {
        this.request.res.status(this.status_code)
            .json({
                status: this.type,
                statusCode: this.status_code,
                code: this.response_code,
                data: data,
                requestId: this.request_id,
                docsUrl: this.docs_url
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

class Response {
    constructor(request) {
        this.request = request;
        this.status_code = 200;
    }

    send(view) {
        this.request.res
            .status(this.status_code)
            .type('text/html')
            .send(view);
    }
}

export { APIResponse, ErrorResponse, Response };