/**
 * POST /employees/login
 * @summary Login an employee
 * @tags Employees - Perform CRUD operations on employees
 * @tags Authentication - Operations for authenticating employees
 * @param {EmployeeLogin} request.body.required - Employee login info
 * @returns {APIResponse} - 200 - Successfully logged in
 * @returns {ErrorResponse} - 401 - Invalid credentials
 * @returns {ErrorResponse} - 422 - Invalid credentials
 * @returns {ErrorResponse} - 500 - Unable to log in
 *
 * @example request - Login an employee
 * {
 *   "username": "johndoe",
 *   "password": "password"
 * }
 *
 * @example response - 200 - Successfully logged in
 * {
 *   "status": "success",
 *   "code": "AUTH_SUCCESS",
 *   "data": {
 *     "message": "Employee successfully logged in.",
 *     "token": "1234567890ebadf.12345678.12345678.12345678"
 *   },
 *   "path": "/api/v2/employees/login",
 *   "method": "POST",
 *   "requestId": "9fee4c70-3d4e-5947-9066-7b374b50cede",
 *   "docs": "/docs/api/v2/employees#login-an-employee"
 * }
 *
 * @example response - 401 - Invalid credentials
 * {
 *   "status": "error",
 *   "code": "INVALID_CREDENTIALS",
 *   "data": {
 *     "message": "Invalid credentials.",
 *     "details": "Username or password is incorrect, please try again.",
 *     "timestamp": "2024-12-06T03:33:16.299Z"
 *   },
 *   "path": "/api/v2/employees/login",
 *   "method": "POST",
 *   "requestId": "9fee4c70-3d4e-5947-9066-7b374b50ceee",
 *   "docs": "/docs/api/v2/employees#login-an-employee"
 * }
 *
 * @example response - 422 - Invalid credentials
 * {
 *   "status": "error",
 *   "code": "INVALID_CREDENTIALS",
 *   "data": {
 *     "message": "Invalid credentials.",
 *     "details": "Username or password is incorrect, please try again.",
 *     "timestamp": "2024-12-06T03:33:16.299Z"
 *   },
 *   "path": "/api/v2/employees/login",
 *   "method": "POST",
 *   "requestId": "9fee4c70-3d4e-5947-9066-7b374b50ceee",
 *   "docs": "/docs/api/v2/employees#login-an-employee"
 * }
 *
 * @example response - 500 - Unable to log in
 * {
 *   "status": "error",
 *   "code": "AUTH_ERROR",
 *     "data": {
 *       "message": "Internal Server Error",
 *       "details": "Unable to log in, please try again.",
 *       "timestamp": "2024-12-06T03:33:16.299Z"
 *     },
 *   "path": "/api/v2/employees/login",
 *   "method": "POST",
 *   "requestId": "9fee4c70-3d4e-5947-9066-7b374b50ceee",
 *   "docs": "/docs/api/v2/employees#login-an-employee"
 * }
 */