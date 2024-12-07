/**
 * POST /products
 * @summary Add a new product
 * @tags Products
 * @param {Product} request.body.required - Product object to be added - application/json
 * @security BearerAuth
 * @returns {APIResponse} - 201 - Product created successfully
 * @returns {ErrorResponse} - 401 - Unauthorized
 * @returns {ErrorResponse} - 403 - Forbidden
 * @returns {ErrorResponse} - 404 - Product not found
 * @returns {ErrorResponse} - 409 - Product already exists
 * @returns {ErrorResponse} - 422 - Validation errors
 * @returns {ErrorResponse} - 500 - Product could not be saved
 *
 * @example request - Add a new product
 * {
 *   "sku": "ABC-1234-56",
 *   "name": "Product Name",
 *   "price": 12.99,
 *   "stockOnHand": 100
 * }
 *
 * @example response - 201 - Product created successfully - application/json
 * {
 *   "status": "success",
 *   "code": "RESOURCE_CREATED",
 *   "data": {
 *     "message": "The product has been successfully created.",
 *     "product": {
 *       "sku": "ABC-1234-56",
 *       "name": "Product Name",
 *       "price": 12.99,
 *       "stockOnHand": 100,
 *       "createdAt": "2024-12-06T03:33:16.299Z",
 *       "updatedAt": "2024-12-06T03:33:16.299Z"
 *     }
 *   },
 *   "path": "/api/v2/products/",
 *   "method": "POST",
 *   "requestId": "9fee4c70-3d4e-5947-9066-7b374b50ceee",
 *   "docs": "/docs/api/v2/products#add-a-new-product"
 * }
 *
 * @example response - 401 - Unauthorized
 * {
 *   "status": "error",
 *   "code": "UNAUTHORIZED",
 *   "data": {
 *     "message": "Unauthorized",
 *     "details": "Please log in to access this resource.",
 *     "timestamp": "2024-12-06T03:33:16.299Z"
 *   },
 *   "path": "/api/v2/products/",
 *   "method": "POST",
 *   "requestId": "9fee4c70-3d4e-5947-9066-7b374b50ceee",
 *   "docs": "/docs/api/v2/products#add-a-new-product"
 * }
 *
 * @example response - 403 - Forbidden
 * {
 *   "status": "error",
 *   "code": "FORBIDDEN",
 *   "data": {
 *     "message": "Forbidden",
 *     "details": "You do not have permission to access this resource.",
 *     "timestamp": "2024-12-06T03:33:16.299Z"
 *   },
 *   "path": "/api/v2/products/",
 *   "method": "POST",
 *   "requestId": "9fee4c70-3d4e-5947-9066-7b374b50ceee",
 *   "docs": "/docs/api/v2/products#add-a-new-product"
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
 *   "method": "DELETE",
 *   "requestId": "9fee4c70-3d4e-5947-9066-7b374b50ceee",
 *   "docs": "/docs/api/v2/products#remove-a-product"
 * }
 *
 * @example response - 409 - Product already exists
 * {
 *   "status": "error",
 *   "code": "RESOURCE_CONFLICT",
 *   "data": {
 *     "message": "Product with SKU ABC-1234-56 already exists.",
 *     "details": "Please check the SKU and try again.",
 *     "timestamp": "2024-12-06T03:33:16.299Z"
 *   },
 *   "path": "/api/v2/products/ABC-1234-56",
 *   "method": "POST",
 *   "requestId": "9fee4c70-3d4e-5947-9066-7b374b50ceee",
 *   "docs": "/docs/api/v2/products#add-a-new-product"
 * }
 *
 * @example response - 422 - Validation errors
 * {
 *   "status": "error",
 *   "code": "VALIDATION_ERROR",
 *   "data": {
 *     "message": "Product could not be saved, due to validation errors.",
 *     "details": [
 *       {
 *         "field": "price",
 *         "message": "Price should be higher than 0",
 *         "value": 0
 *       },
 *       {
 *         "field": "stockOnHand",
 *         "message": "Stock should be higher than 0",
 *         "value": 0
 *       }
 *     ],
 *     "timestamp": "2024-12-06T03:33:16.299Z"
 *   },
 *   "path": "/api/v2/products/",
 *   "method": "POST",
 *   "requestId": "9fee4c70-3d4e-5947-9066-7b374b50ceee",
 *   "docs": "/docs/api/v2/products#add-a-new-product"
 * }
 *
 * @example response - 500 - Product could not be saved
 * {
 *   "status": "error",
 *   "code": "RESOURCE_NOT_SAVED",
 *   "data": {
 *     "message": "Product could not be saved.",
 *     "details": "Please try again.",
 *     "timestamp": "2024-12-06T03:33:16.299Z"
 *   },
 *   "path": "/api/v2/products/",
 *   "method": "POST",
 *   "requestId": "9fee4c70-3d4e-5947-9066-7b374b50ceee",
 *   "docs": "/docs/api/v2/products#add-a-new-product"
 * }
 */