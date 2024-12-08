import BaseResponse from './baseResponse.js';

/**
 * API response class for handling API success responses
 *
 * @typedef {object} APIResponse - API response object
 * @property {string} status - Status of the response - always "success"
 * @property {string} code - Response code (e.g: "RESOURCE_CREATED", "RESOURCE_UPDATED")
 * @property {object} data - Response data {message: string, product: object}
 * @property {string} path - Incoming request path
 * @property {string} method - Incoming request method
 * @property {string} requestId - ID assigned to the request by the server
 * @property {string} docs - URL to the API documentation
 * @example APIResponse
 * {
 * "status": "success",
 * "code": "RESOURCE_CREATED",
 * "data": {
 *   "message": "Product added successfully.",
 *   "product": {
 *      "sku": "AB-1234-56",
 *      "name": "Product Name",
 *      "price": 12.99,
 *      "stockOnHand": 100,
 *      "createdAt": "2024-12-06T03:33:16.299Z",
 *      "updatedAt": "2024-12-06T03:33:16.299Z"
 *   }
 * }
 * path: "/api/v2/products/",
 * method: "POST",
 * requestId: "9fee4c70-3d4e-5947-9066-7b374b50ceee",
 * docs: "/docs/api/v2/products#add-a-new-product"
 */
class APIResponse extends BaseResponse {
    constructor(request) {
        super(request, 'success');
    }
}

export default APIResponse;