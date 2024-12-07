/**
 * Response class for handling non-API responses
 *
 * @param request - Request object - Express request object {@link https://expressjs.com/en/5x/api.html#req}
 * @property {object} request - Request object
 * @property {int} status_code - HTTP status code
 * @property {string} type - Response content type
 * @method asType - Set the response content type
 * @method send - Send the response
 * @returns {HtmlResponse}
 */
class HtmlResponse {
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

export default HtmlResponse;