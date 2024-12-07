/**
 * PATCH /products/{sku}
 * @summary Update a product by SKU
 * @tags Products
 * @param {string} sku.path - SKU of the product - eg: XX-1234-56
 * @param {Product} request.body.required - Product object to update - application/json
 * @security BearerAuth
 * @returns {APIResponse} 200 - Product updated successfully
 * @returns {ErrorResponse} 400 - Update not allowed
 * @returns {ErrorResponse} 404 - Product not found
 * @returns {ErrorResponse} 422 - Update fields required
 * @returns {ErrorResponse} 422 - Validation errors
 * @returns {ErrorResponse} 500 - Resource not updated
 *
 * @example request - Update a product
 * {
 *   "name": "Product Name",
 *   "price": 12.99,
 *   "stockOnHand": 100
 * }
 *
 * @example response - 200 - Product updated successfully
 * {
 *   "status": "success",
 *   "code": "RESOURCE_UPDATED",
 *   "data": {
 *     "message": "The product has been successfully updated.",
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
 *   "method": "PATCH",
 *   "requestId": "9fee4c70-3d4e-5947-9066-7b374b50ceee",
 *   "docs": "/docs/api/v2/products#update-a-product"
 * }
 *
 * @example response - 400 - Update not allowed
 * {
 *   "status": "error",
 *   "code": "UPDATE_NOT_ALLOWED",
 *   "data": {
 *     "message": "SKU cannot be updated.",
 *     "details": "Please remove the SKU field and try again.",
 *     "timestamp": "2024-12-06T03:33:16.299Z"
 *   },
 *   "path": "/api/v2/products/ABC-1234-56",
 *   "method": "PATCH",
 *   "requestId": "9fee4c70-3d4e-5947-9066-7b374b50ceee",
 *   "docs": "/docs/api/v2/products#update-a-product"
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
 *   "method": "PATCH",
 *   "requestId": "9fee4c70-3d4e-5947-9066-7b374b50ceee",
 *   "docs": "/docs/api/v2/products#update-a-product"
 * }
 *
 * @example response - 422 - Update fields required
 * {
 *   "status": "error",
 *   "code": "UPDATE_FIELDS_REQUIRED",
 *   "data": {
 *     "message": "No fields provided for update.",
 *     "details": "Please provide fields to update.",
 *     "timestamp": "2024-12-06T03:33:16.299Z"
 *   },
 *   "path": "/api/v2/products/ABC-1234-56",
 *   "method": "PATCH",
 *   "requestId": "9fee4c70-3d4e-5947-9066-7b374b50ceee",
 *   "docs": "/docs/api/v2/products#update-a-product"
 * }
 *
 * @example response - 422 - Validation errors
 *  {
 *    "status": "error",
 *    "code": "VALIDATION_ERROR",
 *    "data": {
 *      "message": "Product could not be updated, due to validation errors.",
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
 *    "method": "PATCH",
 *    "requestId": "9fee4c70-3d4e-5947-9066-7b374b50ceee",
 *    "docs": "/docs/api/v2/products#update-a-product"
 *  }
 *
 * @example response - 500 - Resource not updated
 * {
 *   "status": "error",
 *   "code": "RESOURCE_NOT_UPDATED",
 *   "data": {
 *     "message": "Product could not be updated.",
 *     "details": "Please try again.",
 *     "timestamp": "2024-12-06T03:33:16.299Z"
 *   },
 *   "path": "/api/v2/products/ABC-1234-56",
 *   "method": "PATCH",
 *   "requestId": "9fee4c70-3d4e-5947-9066-7b374b50ceee",
 *   "docs": "/docs/api/v2/products#update-a-product"
 * }
 */