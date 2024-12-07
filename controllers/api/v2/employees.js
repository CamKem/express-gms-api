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
 * @see ./docs/jsdoc/employees/add.js
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
 * @see ./docs/jsdoc/employees/login.js
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