/**
 * POST /employees
 * @summary Add a new employee
 * @tags Employees - Perform CRUD operations on employees
 * @security BearerAuth
 * @param {Employee} request.body.required - Employee info
 * @return {APIResponse} 201 - Employee successfully created
 * @return {ErrorResponse} 401 - Unauthorized
 * @return {ErrorResponse} 403 - Forbidden
 * @return {ErrorResponse} 409 - Employee with username already exists
 * @return {ErrorResponse} 422 - Employee validation failed
 * @return {ErrorResponse} 500 - Unable to generate a new employee ID
 *
 * @example request - Add a new employee
 * {
 *   "firstName": "John",
 *   "lastName": "Doe",
 *   "username": "johndoe",
 *   "password": "password"
 * }
 *
 * @example response - 201 - Employee successfully created
 * {
 *   "status": "success",
 *   "code": "RESOURCE_CREATED",
 *   "data": {
 *     "message": "Employee successfully created.",
 *     "employee": {
 *       "empId": "EMP-123456",
 *       "firstName": "John",
 *       "lastName": "Doe",
 *       "username": "johndoe",
 *       "createdAt": "2024-12-06T03:33:16.299Z",
 *       "updatedAt": "2024-12-06T03:33:16.299Z"
 *     }
 *   },
 *   "path": "/api/v2/employees/",
 *   "method": "POST",
 *   "requestId": "9fee4c70-3d4e-5947-9066-7b374b50ceee",
 *   "docs": "/docs/api/v2/employees#add-an-employee"
 * }
 *
 * @example response - 401 - Unauthorized
 * {
 *   "status": "error",
 *   "code": "AUTHORIZATION_HEADER_INVALID",
 *   "data": {
 *     "message": "Authorization header is invalid.",
 *     "details": "Unauthorized: Bearer keyword is missing.",
 *     "timestamp": "2024-12-06T03:33:16.299Z"
 *   },
 *   "path": "/api/v2/employees/",
 *   "method": "POST",
 *   "requestId": "9fee4c70-3d4e-5947-9066-7b374b50ceee",
 *   "docs": "/docs/api/v2/employees#add-an-employee"
 * }
 *
 * @example response - 401 - Unauthorized
 * {
 *   "status": "error",
 *   "code": "AUTHORIZATION_HEADER_MISSING",
 *   "data": {
 *     "message": "Authorization header is invalid.",
 *     "details": "Unauthorized: Bearer token is missing.",
 *     "timestamp": "2024-12-06T03:33:16.299Z"
 *   },
 *   "path": "/api/v2/employees/",
 *   "method": "POST",
 *   "requestId": "9fee4c70-3d4e-5947-9066-7b374b50ceee",
 *   "docs": "/docs/api/v2/employees#add-an-employee"
 * }
 *
 * @example response - 401 - Unauthorized
 * {
 *   "status": "error",
 *   "code": "INVALID_TOKEN",
 *   "data": {
 *     "message": "Authentication failure:No valid token found",
 *     "details": "Please log in again to get a new token.",
 *     "timestamp": "2024-12-06T03:33:16.299Z"
 *   },
 *   "path": "/api/v2/employees/",
 *   "method": "POST",
 *   "requestId": "9fee4c70-3d4e-5947-9066-7b374b50ceee",
 *   "docs": "/docs/api/v2/employees#add-an-employee"
 * }
 *
 * @example response - 401 - Unauthorized
 * {
 *   "status": "error",
 *   "code": "INVALID_TOKEN",
 *   "data": {
 *     "message": "Authentication failure: could not verify token.",
 *     "details": "jwt expired",
 *     "timestamp": "2024-12-06T03:33:16.299Z"
 *   },
 *   "path": "/api/v2/employees/",
 *   "method": "POST",
 *   "requestId": "9fee4c70-3d4e-5947-9066-7b374b50ceee",
 *   "docs": "/docs/api/v2/employees#add-an-employee"
 * }
 *
 * @example response - 403 - Forbidden
 * {
 *   "status": "error",
 *   "code": "FORBIDDEN",
 *   "data": {
 *     "message": "Authorization not provided.",
 *     "details": "You need to provide a token in the Authorization header or a cookie.",
 *     "timestamp": "2024-12-06T03:33:16.299Z"
 *   },
 *   "path": "/api/v2/employees/",
 *   "method": "POST",
 *   "requestId": "9fee4c70-3d4e-5947-9066-7b374b50ceee",
 *   "docs": "/docs/api/v2/employees#add-an-employee"
 * }
 *
 * @example response - 409 - Employee with username already exists
 * {
 *   "status": "error",
 *   "code": "RESOURCE_ALREADY_EXISTS",
 *   "data": {
 *     "message": "Employee with username already exists.",
 *     "details": "Please change the username and try again.",
 *     "timestamp": "2024-12-06T03:33:16.299Z"
 *   },
 *   "path": "/api/v2/employees/",
 *   "method": "POST",
 *   "requestId": "9fee4c70-3d4e-5947-9066-7b374b50ceee",
 *   "docs": "/docs/api/v2/employees#add-an-employee"
 * }
 *
 * @example response - 422 - Employee validation failed
 * {
 *   "status": "error",
 *   "code": "VALIDATION_ERROR",
 *   "data": {
 *     "message": "Employee validation failed.",
 *     "details": [
 *       {
 *         "field": "username",
 *         "message": "Username must be unique.",
 *         "value": "johndoe"
 *       }
 *     ],
 *     "timestamp": "2024-12-06T03:33:16.299Z"
 *   },
 *   "path": "/api/v2/employees/",
 *   "method": "POST",
 *   "requestId": "9fee4c70-3d4e-5947-9066-7b374b50ceee",
 *   "docs": "/docs/api/v2/employees#add-an-employee"
 * }
 *
 * @example response - 500 - Unable to generate a new employee ID
 * {
 *   "status": "error",
 *   "code": "RESOURCE_NOT_CREATED",
 *   "data": {
 *     "message": "Unable to generate a new employee ID.",
 *     "details": "Internal Server Error",
 *     "timestamp": "2024-12-06T03:33:16.299Z"
 *   },
 *   "path": "/api/v2/employees/",
 *   "method": "POST",
 *   "requestId": "9fee4c70-3d4e-5947-9066-7b374b50ceee",
 *   "docs": "/docs/api/v2/employees#add-an-employee"
 * }
 */