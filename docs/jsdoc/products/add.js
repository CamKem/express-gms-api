/**
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
 *      "docs": "/docs/api/v2/products#add-a-new-product"
 * }
 */