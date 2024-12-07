/**
 * The Base Response which is extended by the APIResponse and ErrorResponse classes
 *
 * @param {object} request - Request object
 * @param {string} type - Type of response (success or error)
 * @property {object} request - Request object
 * @property {string} type - Type of response (success or error)
 * @property {number} status_code - HTTP status code
 * @property {string} response_code - Response code
 * @property {string} request_id - Request ID
 * @property {string} docs_url - URL to the API documentation
 * @function withCode - Set the response code
 * @function withStatusCode - Set the HTTP status code
 * @function withRequestId - Set the request ID
 * @function withDocsUrl - Set the URL to the API documentation
 * @function withLocation - Set the location header
 * @function withHeaders - Set response headers
 * @function send - Send the response
 */
class BaseResponse {

    constructor(request, type) {
        this.request = request;
        this.type = type;
        this.status_code = 200;
        this.response_code = 'OK';
        this.request_id = request.requestId;
        this.docs_url = `/docs/api/${process.env.API_VERSION}/search/${this.response_code}`;
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

export default BaseResponse;