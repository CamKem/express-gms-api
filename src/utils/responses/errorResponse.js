import BaseResponse from './baseResponse.js';

/**
 * ErrorResponse class, which handles all global error responses
 *
 * @typedef {object} ErrorResponse
 * @property {string} status - Status of the response - always "error"
 * @property {string} code - Response code (e.g: "BAD_REQUEST", "NOT_FOUND")
 * @property {object} data - {message: string, details: string, timestamp: string}
 * @property {string} path - Request path
 * @property {string} method - Request method
 * @property {string} requestId - Request ID
 * @property {string} docs - URL to the API documentation
 * @link https://link.to.api.docs
 */

/**
 * ErrorResponse class
 * @extends BaseResponse
 * @argument Request (Express request object)
 * @constructor(request, 'error')
 */
class ErrorResponse extends BaseResponse {
    constructor(request) {
        super(request, 'error');
    }
}

export default ErrorResponse;