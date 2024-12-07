/**
 * GET /products/{sku}
 * @summary Retrieve a single product by SKU
 * @tags Products
 * @param {string} sku.path - SKU of the product - eg: XX-1234-56
 * @return {APIResponse} 200 - Success response
 * @return {ErrorResponse} 404 - Product not found
 * @return {ErrorResponse} 500 - Server error
 *
 * @example response - 200 - Success response
 * {
 *  "status": "success",
 *   "code": "RESOURCE_RETRIEVED",
 *   "data": {
 *     "message": "The product has been successfully retrieved.",
 *     "product": {
 *       "sku": "ABC-1234-56",
 *       "name": "Product Name",
 *       "price": 12.99,
 *       "stockOnHand": 100,
 *       "createdAt": "2024-12-06T03:33:16.299Z",
 *       "updatedAt": "2024-12-06T03:33:16.299Z"
 *     }
 *   },
 *   "path": "/api/v2/products/ABC-1234-56",
 *   "method": "GET",
 *   "requestId": "9fee4c70-3d4e-5947-9066-7b374b50ceee",
 *   "docs": "/docs/api/v2/products#retrieve-a-product"
 * }
 *
 * @example response - 404 - Product not found
 * {
 *   "status": "error",
 *   "code": "RESOURCE_NOT_FOUND",
 *   "data": {
 *     "message": "Product with SKU ABC-1234-56 not found.",
 *     "details": "Please check the SKU and try again.",
 *     "timestamp": "2024-12-06T03:33:16.299Z"
 *   },
 *   "path": "/api/v2/products/ABC-1234-56",
 *   "method": "GET",
 *   "requestId": "9fee4c70-3d4e-5947-9066-7b374b50ceee",
 *   "docs": "/docs/api/v2/products#retrieve-a-product"
 * }
 *
 * @example response - 500 - Server error
 * {
 *   "status": "error",
 *   "code": "RESOURCE_NOT_RETRIEVED",
 *   "data": {
 *     "message": "Product could not be retrieved.",
 *     "details": "Please try again.",
 *     "timestamp": "2024-12-06T03:33:16.299Z"
 *   },
 *   "path": "/api/v2/products/ABC-1234-56",
 *   "method": "GET",
 *   "requestId": "9fee4c70-3d4e-5947-9066-7b374b50ceee",
 *   "docs": "/docs/api/v2/products#retrieve-a-product"
 * }
 */