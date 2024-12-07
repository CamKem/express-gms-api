/**
 * @example response - 200 - success response
 * {
 *   "status": "success",
 *   "code": "RESOURCE_RETRIEVED",
 *   "data": {
 *     "message": "The products have been successfully retrieved.",
 *     "products": [
 *       {
 *         "sku": "ABC-1234-56",
 *         "name": "Product Name",
 *         "price": 12.99,
 *         "stockOnHand": 100,
 *         "createdAt": "2024-12-06T03:33:16.299Z",
 *         "updatedAt": "2024-12-06T03:33:16.299Z"
 *      },
 *      {
 *        "sku": "DEF-5678-90",
 *        "name": "Another Product",
 *        "price": 24.99,
 *        "stockOnHand": 50,
 *        "createdAt": "2024-12-06T03:33:16.299Z",
 *        "updatedAt": "2024-12-06T03:33:16.299Z"
 *      }
 *     ]
 *   },
 *   "path": "/api/v2/products",
 *   "method": "GET",
 *   "requestId": "9fee4c70-3d4e-5947-9066-7b374b50ceee",
 *   "docs": "/docs/api/v2/products#retrieve-a-list-of-products"
 * }
 *
 * @example response - 500 - Internal server error
 * {
 *   "status": "error",
 *   "code": "RESOURCE_NOT_RETRIEVED",
 *   "data": {
 *     "message": "Products could not be retrieved.",
 *     "details": "Please try again.",
 *     "timestamp": "2024-12-06T03:33:16.299Z"
 *   },
 *   "path": "/api/v2/products",
 *   "method": "GET",
 *   "requestId": "9fee4c70-3d4e-5947-9066-7b374b50ceee",
 *   "docs": "/docs/api/v2/products#retrieve-a-list-of-products"
 * }
 */