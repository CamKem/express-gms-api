/**
 * PUT /products/{sku}
 * @summary Replace a product by SKU
 * @tags Products - Perform CRUD operation on products
 * @param {string} sku.path - SKU of the product - eg: XX-1234-56
 * @param {Product} request.body.required - Product object to replace - application/json
 * @security BearerAuth
 * @returns {APIResponse} 200 - Product replaced successfully
 * @returns {ErrorResponse} 404 - Product not found
 * @returns {ErrorResponse} 422 - Validation errors
 * @returns {ErrorResponse} 500 - Product could not be replaced
 *
 * @example request - Replace a product
 * {
 *   "sku": "ABC-1234-56",
 *   "name": "Product Name",
 *   "price": 12.99,
 *   "stockOnHand": 100
 * }
 *
 * @example response - 200 - Product replaced successfully
 * {
 *   "status": "success",
 *   "code": "RESOURCE_REPLACED",
 *   "data": {
 *     "message": "The product has been successfully replaced.",
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
 *   "method": "PUT",
 *   "requestId": "9fee4c70-3d4e-5947-9066-7b374b50ceee",
 *   "docs": "/docs/api/v2/products#replace-a-product"
 * }
 *
 * @example response - 404 - Product not found
 * {
 *   "status": "error",
 *   "code": "PRODUCT_NOT_FOUND",
 *   "data": {
 *     "message": "Product with SKU ABC-1234-56 not found.",
 *     "details": "Please check the SKU and try again.",
 *     "timestamp": "2024-12-06T03:33:16.299Z"
 *   },
 *   "path": "/api/v2/products/ABC-1234-56",
 *   "method": "PUT",
 *   "requestId": "9fee4c70-3d4e-5947-9066-7b374b50ceee",
 *   "docs": "/docs/api/v2/products#replace-a-product"
 * }
 *
 * @example response - 422 - Validation errors
 *  {
 *    "status": "error",
 *    "code": "VALIDATION_ERROR",
 *    "data": {
 *      "message": "Product could not be replaced, due to validation errors.",
 *      "details": [
 *        {
 *          "field": "price",
 *          "message": "Price should be higher than 0",
 *          "value": 0
 *        }
 *      ],
 *      "timestamp": "2024-12-06T03:33:16.299Z"
 *    },
 *    "path": "/api/v2/products/ABC-1234-56",
 *    "method": "PUT",
 *    "requestId": "9fee4c70-3d4e-5947-9066-7b374b50ceee",
 *    "docs": "/docs/api/v2/products#replace-a-product"
 *  }
 *
 * @example response - 500 - Product could not be replaced
 * {
 *   "status": "error",
 *   "code": "RESOURCE_NOT_REPLACED",
 *   "data": {
 *     "message": "Product could not be replaced.",
 *     "details": "Please try again.",
 *     "timestamp": "2024-12-06T03:33:16.299Z"
 *   },
 *   "path": "/api/v2/products/ABC-1234-56",
 *   "method": "PUT",
 *   "requestId": "9fee4c70-3d4e-5947-9066-7b374b50ceee",
 *   "docs": "/docs/api/v2/products#replace-a-product"
 * }
 */