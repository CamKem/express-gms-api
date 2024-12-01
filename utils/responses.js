/**
 * Response class for handling API responses
 * @constructor
 * @param request
 * @param type
 * @returns Response object
 */
class APIResponse {

    constructor(request, type = 'success') {
        this.request = request;
        this.type = type;
        this.status_code = 200;
        this.response_code = 'OK';
        this.request_id = request.requestId;
        this.docs_url = `${request.get('host')}/docs/${this.response_code}`;
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
 * Error response class for handling API error responses
 * @extends APIResponse
 * @constructor
 * @param request
 */
class ErrorResponse extends APIResponse {
    constructor(request) {
        super(request, 'error');
    }
}

export { APIResponse, ErrorResponse };