import express from 'express';
import {
    BadRequestError,
    ConflictError,
    InternalServerError,
    UnauthorizedError,
    UnprocessableEntityError
} from '../../../utils/errors/errors.js';
import APIResponse from "../../../utils/responses/apiResponses.js";
import mapValidationErrors from "../../../utils/mapValidationErrors.js";
import Employee from "../../../models/Employee.js";
import auth from "../../../middleware/authHandler.js";

/**
 * Employees controller
 * @type {Router}
 *
 * @swagger
 * tags:
 *   name: Employees
 *   description: Employee management
 */

const employees = express.Router();

const currentVersion = process.env.API_VERSION;
const docsUrl = `/docs/api/${currentVersion}/employees`;

/**
 * POST /employees
 * @summary Add a new employee
 * @tags Employees
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
employees.post('/', auth, async (req, res, next) => {
    const {firstName, lastName, username, password} = req.body;
    const endpointDocsUrl = `${docsUrl}#add-an-employee`;
    const employee = new Employee({username, password, firstName, lastName});
    const validated = await employee.validateSync();

    if (validated) {
        throw new UnprocessableEntityError('Employee validation failed.')
            .withCode('VALIDATION_ERROR')
            .withDetails(mapValidationErrors(validated.errors))
            .withDocsUrl(endpointDocsUrl);
    }

    await employee.setEmpId()
        .catch(err => {
            if (err) {
                throw new InternalServerError('Internal Server Error')
                    .withCode('RESOURCE_NOT_CREATED')
                    .withDetails('Unable to generate a new employee ID.')
                    .withDocsUrl(endpointDocsUrl);
            }
            next();
        });

    await employee.save().then(employee => {
        return new APIResponse(req)
            .withStatusCode(201)
            .withCode('RESOURCE_CREATED')
            .withLocation(`${req.baseUrl}/employees/${employee.empId}`)
            .withDocsUrl(endpointDocsUrl)
            .send({
                message: 'Employee successfully created.',
                employee: employee,
            });
    }).catch(err => {
        if (err.code === 11000) {
            throw new ConflictError('Employee with username already exists.')
                .withCode('RESOURCE_ALREADY_EXISTS')
                .withDocsUrl(endpointDocsUrl)
                .withDetails('Please change the username and try again.');
        }
        throw new InternalServerError('Internal Server Error')
            .withCode('RESOURCE_NOT_CREATED')
            .withDetails('Unable to create a new employee, please try again.')
            .withDocsUrl(endpointDocsUrl);
    }).catch(next);
});

/**
 * POST /employees/login
 * @summary Login an employee
 * @tags Employees
 * @param {EmployeeLogin} request.body.required - Employee login info
 * @returns {APIResponse} - 200 - Successfully logged in
 * @returns {UnauthorizedError} - 401 - Invalid credentials
 * @returns {UnprocessableEntityError} - 422 - Invalid credentials
 * @returns {InternalServerError} - 500 - Unable to log in
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
employees.post('/login', async (req, res, next) => {
    const {username, password} = req.body;
    const endpointDocsUrl = `${docsUrl}#login-an-employee`;

    // Find the employee by username and include the password
    await Employee.findOne({username}).select('+password')
        .then(employee => {
            if (!employee) {
                throw new UnauthorizedError('Invalid credentials.')
                    .withCode('INVALID_CREDENTIALS')
                    .withDetails('Username or password is incorrect, please try again.')
                    .withDocsUrl(endpointDocsUrl);
            }

            // Check if the password matches
            employee.matchPassword(password)
                .then(isMatch => {
                    if (!isMatch) {
                        throw new UnprocessableEntityError('Invalid credentials.')
                            .withCode('INVALID_CREDENTIALS')
                            .withDetails('Username or password is incorrect, please try again.')
                            .withDocsUrl(endpointDocsUrl);
                    }

                    const token = employee.generateAuthToken();

                    req.res.cookie('token', token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production', // Set to true in production
                        sameSite: 'strict',
                        maxAge: process.env.JWT_COOKIE_EXPIRES_IN
                            ? parseInt(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
                            : 7 * 24 * 60 * 60 * 1000, // Default to 7 days
                    });

                    return new APIResponse(req)
                        .withStatusCode(200)
                        .withCode('AUTH_SUCCESS')
                        .withDocsUrl(endpointDocsUrl)
                        .addProperty('token', token)
                        .send({
                            message: 'Employee successfully logged in.',
                            token: token,
                        });
                })
                .catch(next);
        }).catch(err => {
            if (err) {
                throw new InternalServerError('Internal Server Error')
                    .withCode('AUTH_ERROR')
                    .withDetails('Unable to log in, please try again.')
                    .withDocsUrl(endpointDocsUrl);
            }
            return next();
        });
});

export default employees;