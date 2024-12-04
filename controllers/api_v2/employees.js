import express from 'express';
import {
    BadRequestError,
    ConflictError,
    InternalServerError,
    UnauthorizedError,
    UnprocessableEntityError
} from '../../utils/errors.js';
import {APIResponse} from "../../utils/responses.js";
import mapValidationErrors from "../../utils/mapValidationErrors.js";
import Employee from "../../models/Employee.js";
import auth from "../../middleware/authHandler.js";

/**
 * Product controller
 * @type {Router}
 */
const employees = express.Router();

const currentVersion = process.env.API_VERSION;
const docsUrl = `/docs/api/${currentVersion}/employees`;

/**
 *
 * @route   POST /api/v1/employees
 * @desc    Add a new employee
 * @access  Private
 * @param   {string} firstName - Employee's first name
 * @param   {string} lastName - Employee's last name
 * @param   {string} username - Employee's username
 * @param   {string} password - Employee's password
 * @returns {object} - New employee object
 *
 * @throws  {ConflictError} - 409 - Employee with username already exists
 * @throws  {UnprocessableEntityError} - 422 - Employee validation failed
 * @throws  {InternalServerError} - 500 - Unable to generate a new employee ID
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
 * @route   POST /api/v1/employees/login
 * @desc    Login an employee
 * @access  Public
 * @param   {string} username - Employee's username
 * @param   {string} password - Employee's password
 * @returns {object} - Employee object
 * @throws  {UnauthorizedError} - 401 - Invalid credentials
 * @throws  {UnprocessableEntityError} - 422 - Invalid credentials
 * @throws  {InternalServerError} - 500 - Unable to log in
 */
employees.post('/login', async (req, res, next) => {
    const {username, password} = req.body;
    const endpointDocsUrl = `${docsUrl}#login-an-employee`;
    
    // Find the employee by username and include the password
    await Employee.findOne({username}).select('+password')
        .then(employee => {
            if (!employee) {
                throw new BadRequestError('Invalid credentials.')
                    .withCode('INVALID_CREDENTIALS')
                    .withDetails('Username or password is incorrect, please try again.')
                    .withDocsUrl(endpointDocsUrl);
            }

            // Check if the password matches
            employee.matchPassword(password)
                .then(isMatch => {
                    if (!isMatch) {
                        throw new UnauthorizedError('Invalid credentials.')
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
                        .send({
                            message: 'Employee successfully logged in.',
                            token: token,
                        });
                })
                .catch(next);
        }).catch(err => {
            return next(new InternalServerError('Internal Server Error')
                .withCode('AUTH_ERROR')
                .withDetails('Unable to log in, please try again.')
                .withDocsUrl(endpointDocsUrl));
        });
});

export default employees;